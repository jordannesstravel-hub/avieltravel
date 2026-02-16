"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Offer = {
  id: number;
  title: string | null;
  category: string | null;
  route: string | null;
  trip: string | null; // "RT" ou "OW"
  depart_date: string | null; // yyyy-mm-dd
  return_date: string | null; // yyyy-mm-dd
  price: number | null;

  // ⚠️ Dans ta DB tu as "ailine" (faute), pas "airline"
  ailine?: string | null;

  cabin_bag?: string | null;
  checked_bag?: string | null;

  depart_time?: string | null; // "HH:MM:SS"
  arrive_time?: string | null; // "HH:MM:SS"
  return_depart_time?: string | null; // "HH:MM:SS"
  return_arrive_time?: string | null; // "HH:MM:SS"

  priority?: number | null;
};

function hhmm(t?: string | null) {
  if (!t) return "-";
  return String(t).slice(0, 5);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function FlightsRoutePage() {
  const router = useRouter();
  const params = useParams<{ lang: string; route: string }>();
  const sp = useSearchParams();

  const lang = params?.lang || "fr";
  const routeSlug = params?.route || ""; // ex: "tlv" mais on s’en sert juste pour l’URL

  // Query string
  const fromQ = (sp.get("from") || "").toUpperCase();
  const toQ = (sp.get("to") || "").toUpperCase();
  const tripQ = (sp.get("trip") || "RT").toUpperCase(); // RT / OW
  const departQ = sp.get("depart") || "";
  const returnQ = sp.get("return") || "";

  // Form state
  const [from, setFrom] = useState(fromQ || "PARIS");
  const [to, setTo] = useState(toQ || "TLV");
  const [trip, setTrip] = useState<"RT" | "OW">((tripQ === "OW" ? "OW" : "RT") as any);
  const [depart, setDepart] = useState(departQ || "");
  const [ret, setRet] = useState(returnQ || "");

  // Data state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [offers, setOffers] = useState<Offer[]>([]);

  const routeKey = useMemo(() => {
    // IMPORTANT: dans la DB on stocke route style "PARIS-TLV"
    const f = (fromQ || from || "").trim().toUpperCase();
    const t = (toQ || to || "").trim().toUpperCase();
    if (!f || !t) return "";
    return `${f}-${t}`;
  }, [fromQ, toQ, from, to]);

  const hasEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  async function fetchOffers() {
    setErrorMsg("");
    setOffers([]);

    if (!hasEnv) {
      setErrorMsg("Supabase: variables d’environnement manquantes (URL / ANON KEY).");
      return;
    }

    const f = (fromQ || from).trim().toUpperCase();
    const t = (toQ || to).trim().toUpperCase();
    const r = `${f}-${t}`;

    const d = departQ || depart;
    const rr = returnQ || ret;
    const tr = (tripQ === "OW" ? "OW" : "RT") as "OW" | "RT";

    // Si pas de date, on ne charge pas (ça évite une page vide chelou)
    if (!d) return;

    try {
      setLoading(true);

      let query = supabase
        .from("offers_flight")
        .select(
          "id,title,category,route,trip,depart_date,return_date,price,priority,ailine,cabin_bag,checked_bag,depart_time,arrive_time,return_depart_time,return_arrive_time"
        )
        .eq("route", r)
        .eq("trip", tr)
        .eq("depart_date", d);

      if (tr === "RT") {
        if (!rr) {
          setErrorMsg("Tu es en Aller-Retour mais il manque la date retour.");
          setLoading(false);
          return;
        }
        query = query.eq("return_date", rr);
      }

      const { data, error } = await query
        .order("priority", { ascending: true, nullsFirst: true })
        .order("price", { ascending: true, nullsLast: true });

      if (error) {
        setErrorMsg(`Erreur Supabase: ${error.message}`);
        return;
      }

      setOffers((data as Offer[]) || []);
    } catch (e: any) {
      setErrorMsg(`Erreur: ${e?.message || "inconnue"}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // recharge quand l’URL change
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromQ, toQ, tripQ, departQ, returnQ]);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    const f = from.trim().toUpperCase();
    const t = to.trim().toUpperCase();
    const tr = trip;

    if (!f || !t || !depart) {
      alert("Remplis au minimum : From, To, Date départ.");
      return;
    }
    if (tr === "RT" && !ret) {
      alert("En Aller-Retour, tu dois mettre la date retour.");
      return;
    }

    const qs = new URLSearchParams();
    qs.set("from", f);
    qs.set("to", t);
    qs.set("trip", tr);
    qs.set("depart", depart);
    if (tr === "RT") qs.set("return", ret);

    // On garde le même routeSlug (ex tlv) car c’est ta structure d’URL
    router.push(`/${lang}/flights/${routeSlug}?${qs.toString()}`);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Nos offres vols</h1>

      <form
        onSubmit={submit}
        style={{
          background: "white",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginTop: 16,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontWeight: 600 }}>From</label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="PARIS"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>To</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="TLV"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Type</label>
            <select
              value={trip}
              onChange={(e) => setTrip(e.target.value as any)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            >
              <option value="RT">Aller-retour</option>
              <option value="OW">Aller simple</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Date départ</label>
            <input
              type="date"
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>

          {trip === "RT" && (
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontWeight: 600 }}>Date retour</label>
              <input
                type="date"
                value={ret}
                onChange={(e) => setRet(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            marginTop: 14,
            background: "#f25c3d",
            color: "white",
            border: "none",
            padding: "10px 14px",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Voir les offres
        </button>
      </form>

      {loading && <p style={{ marginTop: 14 }}>Chargement…</p>}
      {errorMsg && <p style={{ marginTop: 14, color: "crimson" }}>{errorMsg}</p>}

      <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
        {(!loading && offers.length === 0 && departQ) && (
          <div style={{ padding: 14, background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
            Aucune offre trouvée pour <b>{routeKey}</b> ({tripQ}) aux dates demandées.
          </div>
        )}

        {offers.map((o) => (
          <div
            key={o.id}
            style={{
              padding: 18,
              background: "white",
              borderRadius: 14,
              border: "1px solid #eee",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800 }}>{o.title || "Offre"}</div>

            <div style={{ marginTop: 10, lineHeight: 1.6 }}>
              <div><b>Compagnie :</b> {o.ailine || "-"}</div>
              <div><b>Bagage cabine :</b> {o.cabin_bag || "-"}</div>
              <div><b>Bagage soute :</b> {o.checked_bag || "-"}</div>

              <div style={{ marginTop: 12 }}>
                <b>Aller :</b><br />
                Date : {o.depart_date || "-"}<br />
                Départ : {hhmm(o.depart_time)}<br />
                Arrivée : {hhmm(o.arrive_time)}
              </div>

              {o.trip === "RT" && (
                <div style={{ marginTop: 12 }}>
                  <b>Retour :</b><br />
                  Date : {o.return_date || "-"}<br />
                  Départ : {hhmm(o.return_depart_time)}<br />
                  Arrivée : {hhmm(o.return_arrive_time)}
                </div>
              )}
            </div>

            <div style={{ marginTop: 14, fontSize: 22, fontWeight: 900 }}>
              {o.price != null ? `${o.price}€` : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
