"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Props = {
  params: {
    lang: string;
    route: string; // ex: "tlv" ou "paris"
  };
};

type TripType = "RT" | "OW";

type Offer = {
  id: number;
  title: string | null;
  category: string | null;
  active: boolean | null;

  route: string | null; // "PARIS_TLV" | "TLV_PARIS"
  trip: TripType | string | null; // "RT" | "OW"

  depart_date: string | null; // "YYYY-MM-DD"
  return_date: string | null;

  airline: string | null;
  cabin_bag: string | null;
  checked_bag: string | null;

  depart_time: string | null;
  arrive_time: string | null;
  return_depart_time: string | null;
  return_arrive_time: string | null;

  price_eur: number | null;
  priority: number | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalizeCity(s: string) {
  return s.trim().toLowerCase();
}

function getDbRoute(from: string, to: string): "PARIS_TLV" | "TLV_PARIS" | null {
  const f = normalizeCity(from);
  const t = normalizeCity(to);

  const isParis = (x: string) => x === "paris";
  const isTLV = (x: string) => x === "tel aviv" || x === "tlv" || x === "tel-aviv";

  if (isParis(f) && isTLV(t)) return "PARIS_TLV";
  if (isTLV(f) && isParis(t)) return "TLV_PARIS";
  return null;
}

function toISODateInputValue(d: Date) {
  // YYYY-MM-DD
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function FlightRoutePage({ params }: Props) {
  // Presets selon URL
  const preset = useMemo(() => {
    const slug = (params.route || "").toLowerCase();
    // /flights/tlv -> Paris => Tel Aviv
    if (slug === "tlv") return { from: "Paris", to: "Tel Aviv" };
    // /flights/paris -> Tel Aviv => Paris
    if (slug === "paris") return { from: "Tel Aviv", to: "Paris" };
    // fallback
    return { from: "Paris", to: "Tel Aviv" };
  }, [params.route]);

  const [from, setFrom] = useState(preset.from);
  const [to, setTo] = useState(preset.to);
  const [trip, setTrip] = useState<TripType>("RT");

  const [departDate, setDepartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return toISODateInputValue(d);
  });

  const [returnDate, setReturnDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return toISODateInputValue(d);
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Si on change d’URL (tlv/paris), on remet les presets
  useEffect(() => {
    setFrom(preset.from);
    setTo(preset.to);
  }, [preset.from, preset.to]);

  // Si OW, on vide returnDate pour éviter confusion
  useEffect(() => {
    if (trip === "OW") setReturnDate("");
  }, [trip]);

  const dbRoute = useMemo(() => getDbRoute(from, to), [from, to]);

  async function fetchOffers() {
    setLoading(true);
    setError(null);
    setOffers([]);

    const routeValue = dbRoute;
    if (!routeValue) {
      setLoading(false);
      setError("Route non supportée. Utilise Paris ↔ Tel Aviv.");
      return;
    }
    if (!departDate) {
      setLoading(false);
      setError("Choisis une date de départ.");
      return;
    }
    if (trip === "RT" && !returnDate) {
      setLoading(false);
      setError("Choisis une date de retour (ou passe en Aller simple).");
      return;
    }

    try {
      // IMPORTANT: adapte si tu veux autre catégorie que PROMO
      let q = supabase
        .from("offers_flight")
        .select("*")
        .eq("active", true)
        .eq("category", "PROMO")
        .eq("route", routeValue)
        .eq("trip", trip)
        .eq("depart_date", departDate)
        .order("priority", { ascending: false })
        .order("price_eur", { ascending: true });

      if (trip === "RT") {
        q = q.eq("return_date", returnDate);
      }

      const { data, error } = await q;

      if (error) {
        setError(`Erreur Supabase : ${error.message}`);
      } else {
        setOffers((data as Offer[]) || []);
        if (!data || (data as Offer[]).length === 0) {
          const label = `${routeValue} (${trip})`;
          setError(`Aucune offre trouvée pour ${label} à cette date.`);
        }
      }
    } catch (e: any) {
      setError(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 16 }}>
        Nos offres vols
      </h1>

      <div
        style={{
          background: "rgba(0,0,0,0.03)",
          borderRadius: 14,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 160px",
            gap: 12,
            alignItems: "end",
          }}
        >
          <div>
            <label style={{ fontSize: 12, opacity: 0.7 }}>From</label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Paris"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, opacity: 0.7 }}>To</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Tel Aviv"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={swap}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.2)",
                background: "white",
                cursor: "pointer",
                width: "100%",
              }}
            >
              🔁 Inverser
            </button>
          </div>

          <div>
            <label style={{ fontSize: 12, opacity: 0.7 }}>Date départ</label>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, opacity: 0.7 }}>
              Date retour {trip === "OW" ? "(désactivé)" : ""}
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              disabled={trip === "OW"}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
                opacity: trip === "OW" ? 0.5 : 1,
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, opacity: 0.7 }}>Type</label>
            <select
              value={trip}
              onChange={(e) => setTrip(e.target.value as TripType)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            >
              <option value="RT">Aller-retour</option>
              <option value="OW">Aller simple</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
          <button
            type="button"
            onClick={fetchOffers}
            disabled={loading}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: "#d46a5c",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Chargement..." : "Voir les offres"}
          </button>

          <div style={{ fontSize: 13, opacity: 0.75 }}>
            DB route : <b>{dbRoute ?? "—"}</b>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 10, color: "#b00020", fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {offers.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {offers.map((o) => (
            <div
              key={o.id}
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 14,
                padding: 16,
                background: "white",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                {o.title ?? `${from} → ${to} (${trip === "OW" ? "Aller simple" : "Aller-retour"})`}
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                {o.airline && (
                  <div>
                    <b>Compagnie :</b> {o.airline}
                  </div>
                )}
                {o.cabin_bag && (
                  <div>
                    <b>Bagage cabine :</b> {o.cabin_bag}
                  </div>
                )}
                {o.checked_bag && (
                  <div>
                    <b>Bagage soute :</b> {o.checked_bag}
                  </div>
                )}

                <div style={{ marginTop: 8 }}>
                  <b>Aller :</b>
                  <div>Date : {o.depart_date ?? "-"}</div>
                  {o.depart_time && <div>Départ : {o.depart_time}</div>}
                  {o.arrive_time && <div>Arrivée : {o.arrive_time}</div>}
                </div>

                {trip === "RT" && (
                  <div style={{ marginTop: 8 }}>
                    <b>Retour :</b>
                    <div>Date : {o.return_date ?? "-"}</div>
                    {o.return_depart_time && <div>Départ : {o.return_depart_time}</div>}
                    {o.return_arrive_time && <div>Arrivée : {o.return_arrive_time}</div>}
                  </div>
                )}

                <div style={{ marginTop: 10, fontSize: 22, fontWeight: 900 }}>
                  {o.price_eur != null ? `${o.price_eur}€` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
