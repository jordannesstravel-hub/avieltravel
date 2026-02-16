"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

type OfferFlight = {
  id: number;
  created_at?: string;

  route?: string | null; // ex: "PARIS_TLV"
  title?: string | null;
  category?: string | null;

  trip?: string | null; // "RT" ou "OW" (ou "aller-retour"/"aller-simple" selon tes données)
  depart_date?: string | null; // "YYYY-MM-DD"
  return_date?: string | null; // "YYYY-MM-DD"
  price?: number | string | null;

  // ⚠️ chez toi c'est "ailine" (typo), on garde aussi airline en fallback
  ailine?: string | null;
  airline?: string | null;

  cabin_bag?: string | null;
  checked_bag?: string | null;

  depart_time?: string | null; // "10:30:00" ou "10:30"
  arrive_time?: string | null;

  return_depart_time?: string | null;
  return_arrive_time?: string | null;

  priority?: number | null;
};

// --- Supabase client (browser) ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helpers
function hhmm(t?: string | null) {
  if (!t) return "-";
  const s = String(t);
  // gère "10:30:00" ou "10:30"
  return s.length >= 5 ? s.slice(0, 5) : s;
}

function formatPrice(v?: number | string | null) {
  if (v === null || v === undefined || v === "") return "";
  const n = typeof v === "string" ? Number(v) : v;
  if (!Number.isNaN(n)) return `${n}€`;
  return `${v}€`;
}

export default function Page({
  params,
}: {
  params: { lang: string; route: string };
}) {
  const router = useRouter();
  const sp = useSearchParams();

  // Valeurs par défaut depuis l'URL (?from=PARIS&to=TLV&trip=RT&depart=2026-03-31&return=2026-04-12)
  const [from, setFrom] = useState(sp.get("from") || "Paris");
  const [to, setTo] = useState(sp.get("to") || "Tel Aviv");
  const [tripType, setTripType] = useState(sp.get("trip") || "RT"); // RT / OW
  const [departDate, setDepartDate] = useState(sp.get("depart") || "");
  const [returnDate, setReturnDate] = useState(sp.get("return") || "");

  const [offers, setOffers] = useState<OfferFlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Route DB (chez toi tu as mis "PARIS_TLV")
  const routeKey = useMemo(() => {
    const f = (from || "").trim().toUpperCase().replace(/\s+/g, "");
    const t = (to || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!f || !t) return params.route?.toUpperCase() || "";
    return `${f}_${t}`;
  }, [from, to, params.route]);

  // Quand on change le type -> si aller simple, on vide la date retour
  useEffect(() => {
    if (tripType === "OW") setReturnDate("");
  }, [tripType]);

  async function fetchOffers() {
    setLoading(true);
    setErr(null);

    try {
      let q = supabase
        .from("offers_flight")
        .select(
          "id, title, trip, route, depart_date, return_date, price, ailine, airline, cabin_bag, checked_bag, depart_time, arrive_time, return_depart_time, return_arrive_time, priority"
        );

      // Filtre route
      if (routeKey) q = q.eq("route", routeKey);

      // Filtre trip
      // Chez toi c'est probablement "RT" / "OW". Si tu as autre chose, dis-moi et j’adapte.
      if (tripType) q = q.eq("trip", tripType);

      // Filtre dates
      if (departDate) q = q.eq("depart_date", departDate);
      if (tripType === "RT") {
        if (returnDate) q = q.eq("return_date", returnDate);
      } else {
        // aller simple -> on accepte return_date NULL
        q = q.is("return_date", null);
      }

      // Tri : priorité d’abord si existe, sinon id desc
      q = q.order("priority", { ascending: true, nullsFirst: false }).order("id", { ascending: false });

      const { data, error } = await q;

      if (error) throw error;

      setOffers((data || []) as OfferFlight[]);
    } catch (e: any) {
      setOffers([]);
      setErr(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  function onSearchClick() {
    // Met à jour l’URL pour que ça reste partageable
    const qs = new URLSearchParams();
    qs.set("from", from);
    qs.set("to", to);
    qs.set("trip", tripType);
    if (departDate) qs.set("depart", departDate);
    if (tripType === "RT" && returnDate) qs.set("return", returnDate);

    router.push(`/${params.lang}/flights/${params.route}?${qs.toString()}`);
    fetchOffers();
  }

  // Auto-fetch si l’URL contient déjà des paramètres
  useEffect(() => {
    const hasMin =
      (sp.get("from") || sp.get("to") || sp.get("trip") || sp.get("depart")) !== null;
    if (hasMin) {
      fetchOffers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 18 }}>
      <h1 style={{ fontSize: 32, marginBottom: 10 }}>Nos offres vols</h1>

      {/* --- MOTEUR DE RECHERCHE --- */}
      <div
        style={{
          background: "#f2f6ff",
          border: "1px solid #d9e3ff",
          borderRadius: 14,
          padding: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <label style={{ fontWeight: 700 }}>From</label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={inputStyle}
              placeholder="Paris"
            />
          </div>

          <div>
            <label style={{ fontWeight: 700 }}>To</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={inputStyle}
              placeholder="Tel Aviv"
            />
          </div>

          <div>
            <label style={{ fontWeight: 700 }}>Type</label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              style={inputStyle}
            >
              <option value="RT">Aller-retour</option>
              <option value="OW">Aller simple</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 700 }}>Date départ</label>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontWeight: 700, opacity: tripType === "OW" ? 0.45 : 1 }}>
              Date retour
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              style={{
                ...inputStyle,
                opacity: tripType === "OW" ? 0.45 : 1,
              }}
              disabled={tripType === "OW"}
            />
          </div>
        </div>

        <button
          onClick={onSearchClick}
          style={{
            marginTop: 12,
            background: "#f05a28",
            color: "white",
            fontWeight: 800,
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          Voir les offres
        </button>

        {loading && <div style={{ marginTop: 10 }}>Chargement…</div>}
        {err && (
          <div style={{ marginTop: 10, color: "#c62828", fontWeight: 700 }}>
            Erreur Supabase : {err}
          </div>
        )}
      </div>

      {/* --- RESULTATS --- */}
      <div style={{ display: "grid", gap: 14 }}>
        {!loading && !err && offers.length === 0 && (
          <div style={{ opacity: 0.75 }}>
            Aucune offre trouvée (essaie une autre date / route / type).
          </div>
        )}

        {offers.map((o) => {
          const company = o.ailine || o.airline || "-";

          return (
            <div
              key={o.id}
              style={{
                border: "1px solid #e6e6e6",
                borderRadius: 14,
                padding: 16,
                background: "white",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>
                {o.title || "OFFRE"}
              </div>

              <div style={{ lineHeight: 1.55 }}>
                <div>
                  <strong>Compagnie :</strong> {company}
                </div>
                <div>
                  <strong>Bagage cabine :</strong> {o.cabin_bag || "-"}
                </div>
                <div>
                  <strong>Bagage soute :</strong> {o.checked_bag || "-"}
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>Aller :</strong>
                  <br />
                  Date : {o.depart_date || "-"}
                  <br />
                  Départ : {hhmm(o.depart_time)}
                  <br />
                  Arrivée : {hhmm(o.arrive_time)}
                </div>

                {o.trip === "RT" && (
                  <div style={{ marginTop: 12 }}>
                    <strong>Retour :</strong>
                    <br />
                    Date : {o.return_date || "-"}
                    <br />
                    Départ : {hhmm(o.return_depart_time)}
                    <br />
                    Arrivée : {hhmm(o.return_arrive_time)}
                  </div>
                )}

                <div style={{ marginTop: 12, fontSize: 20, fontWeight: 900 }}>
                  {formatPrice(o.price)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTACT (si tu veux le laisser) */}
      <div style={{ marginTop: 26, opacity: 0.85 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Contact</div>
        <div>📞 FR: 01 85 43 13 75</div>
        <div>📞 IL: +972 55 772 6027 • +972 55 966 1683</div>
        <div>💬 WhatsApp: 06 11 09 07 31</div>
        <div>✉️ resa.isradmc@gmail.com • jordan.nesstravel@gmail.com</div>
        <div style={{ marginTop: 6, fontSize: 12 }}>
          Prix indicatifs sous réserve de disponibilité.
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d6d6d6",
  marginTop: 6,
  outline: "none",
};
