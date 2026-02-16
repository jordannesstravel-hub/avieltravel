"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useSearchParams } from "next/navigation";

type OfferFlight = {
  id: number;
  title: string | null;
  category: string | null;
  trip: string | null; // "RT" ou "OW"
  route: string | null;

  depart_date: string | null; // YYYY-MM-DD
  return_date: string | null; // YYYY-MM-DD

  price: number | null;

  // Détails
  airline: string | null; // ATTENTION: chez toi c'est "ailine" (faute) -> voir plus bas
  ailine?: string | null;

  cabin_bag: string | null;
  checked_bag: string | null;

  depart_time: string | null; // "10:30:00"
  arrive_time: string | null;

  return_depart_time: string | null;
  return_arrive_time: string | null;
};

function fmtTime(t?: string | null) {
  if (!t) return "-";
  // "10:30:00" -> "10:30"
  return String(t).slice(0, 5);
}

function routeToFromTo(routeParam: string) {
  // Tu peux compléter d'autres routes plus tard
  // /fr/flights/tlv => PARIS -> Tel Aviv
  const r = (routeParam || "").toLowerCase();
  if (r === "tlv") return { fromLabel: "Paris", toLabel: "Tel Aviv", routeKey: "PARIS_TLV" };
  if (r === "eilat") return { fromLabel: "Paris", toLabel: "Eilat", routeKey: "PARIS_EILAT" };
  return { fromLabel: "Paris", toLabel: routeParam.toUpperCase(), routeKey: `PARIS_${routeParam.toUpperCase()}` };
}

export default function Page() {
  const params = useParams<{ lang: string; route: string }>();
  const searchParams = useSearchParams();

  const { route } = params;

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
  }, []);

  const routeInfo = useMemo(() => routeToFromTo(route), [route]);

  // Valeurs par défaut (si rien dans l’URL)
  const todayPlus = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const [tripType, setTripType] = useState<string>(searchParams.get("trip") || "RT");
  const [departDate, setDepartDate] = useState<string>(searchParams.get("depart") || todayPlus(30));
  const [returnDate, setReturnDate] = useState<string>(searchParams.get("return") || todayPlus(37));

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [offers, setOffers] = useState<OfferFlight[]>([]);

  async function fetchOffers() {
    setLoading(true);
    setErrorMsg("");

    try {
      // IMPORTANT:
      // Dans ta table, la colonne "airline" existe en double chez toi (airline + ailine)
      // et tu as réussi à remplir "ailine" (faute).
      // Donc on va sélectionner les deux et utiliser celle qui est remplie.

      let q = supabase
        .from("offers_flight")
        .select(
          "id,title,category,trip,route,depart_date,return_date,price,airline,ailine,cabin_bag,checked_bag,depart_time,arrive_time,return_depart_time,return_arrive_time"
        )
        .eq("route", routeInfo.routeKey)
        .eq("depart_date", departDate);

      if (tripType === "RT") {
        q = q.eq("trip", "RT").eq("return_date", returnDate);
      } else {
        // Aller simple
        q = q.eq("trip", "OW");
      }

      const { data, error } = await q.order("price", { ascending: true });

      if (error) throw error;

      setOffers((data || []) as OfferFlight[]);
    } catch (e: any) {
      setOffers([]);
      setErrorMsg(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Charge une première fois automatiquement
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 18 }}>Nos offres vols</h1>

      {/* Moteur de recherche */}
      <div
        style={{
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 18,
          background: "white",
        }}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>From</div>
            <input
              value={routeInfo.fromLabel}
              readOnly
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
            />
          </div>

          <div style={{ flex: "1 1 260px" }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>To</div>
            <input
              value={routeInfo.toLabel}
              readOnly
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
            />
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Type</div>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
            >
              <option value="RT">Aller-retour</option>
              <option value="OW">Aller simple</option>
            </select>
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Date départ</div>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
            />
          </div>

          {tripType === "RT" && (
            <div style={{ flex: "1 1 220px" }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Date retour</div>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
              />
            </div>
          )}
        </div>

        <button
          onClick={fetchOffers}
          disabled={loading}
          style={{
            marginTop: 14,
            background: "#e4572e",
            color: "white",
            border: "none",
            padding: "10px 14px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {loading ? "Chargement..." : "Voir les offres"}
        </button>

        {errorMsg && (
          <div style={{ marginTop: 10, color: "#b00020", fontWeight: 600 }}>Erreur Supabase : {errorMsg}</div>
        )}
      </div>

      {/* Résultats */}
      {offers.length === 0 && !loading && !errorMsg && (
        <div style={{ opacity: 0.75 }}>
          Aucune offre trouvée pour {routeInfo.routeKey} ({tripType}) à cette date.
        </div>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {offers.map((o) => {
          const airlineName = o.airline || o.ailine || "-";

          return (
            <div
              key={o.id}
              style={{
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 14,
                padding: 16,
                background: "white",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{o.title || "Offre"}</div>

              <div style={{ lineHeight: 1.7 }}>
                <div>
                  <strong>Compagnie :</strong> {airlineName}
                </div>
                <div>
                  <strong>Bagage cabine :</strong> {o.cabin_bag || "-"}
                </div>
                <div>
                  <strong>Bagage soute :</strong> {o.checked_bag || "-"}
                </div>

                <div style={{ marginTop: 10 }}>
                  <strong>Aller :</strong>
                  <br />
                  Date : {o.depart_date || "-"}
                  <br />
                  Départ : {fmtTime(o.depart_time)}
                  <br />
                  Arrivée : {fmtTime(o.arrive_time)}
                </div>

                {o.trip === "RT" && (
                  <div style={{ marginTop: 10 }}>
                    <strong>Retour :</strong>
                    <br />
                    Date : {o.return_date || "-"}
                    <br />
                    Départ : {fmtTime(o.return_depart_time)}
                    <br />
                    Arrivée : {fmtTime(o.return_arrive_time)}
                  </div>
                )}

                <div style={{ marginTop: 12, fontSize: 22, fontWeight: 900 }}>
                  {o.price != null ? `${o.price}€` : "-"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
