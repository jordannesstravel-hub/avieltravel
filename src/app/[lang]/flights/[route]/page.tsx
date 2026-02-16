"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("offers_flight")
        .select("*")
        .order("priority", { ascending: true });

      if (!error && data) {
        setData(data);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Chargement...</div>;

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 30 }}>Nos offres vols</h1>

      {data.length === 0 && <div>Aucune offre disponible</div>}

      {data.map((o: any) => (
        <div
          key={o.id}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 20,
            borderRadius: 10,
          }}
        >
          <h2>{o.title}</h2>

          <div style={{ marginTop: 10 }}>
            <strong>Compagnie :</strong> {o.ailine ?? "-"}
          </div>

          <div>
            <strong>Bagage cabine :</strong> {o.cabin_bag ?? "-"}
          </div>

          <div>
            <strong>Bagage soute :</strong> {o.checked_bag ?? "-"}
          </div>

          <div style={{ marginTop: 15 }}>
            <strong>Aller :</strong><br />
            Date : {o.depart_date}<br />
            Départ : {o.depart_time
              ? String(o.depart_time).slice(0, 5)
              : "-"}<br />
            Arrivée : {o.arrive_time
              ? String(o.arrive_time).slice(0, 5)
              : "-"}
          </div>

          <div style={{ marginTop: 15 }}>
            <strong>Retour :</strong><br />
            Date : {o.return_date}<br />
            Départ : {o.return_depart_time
              ? String(o.return_depart_time).slice(0, 5)
              : "-"}<br />
            Arrivée : {o.return_arrive_time
              ? String(o.return_arrive_time).slice(0, 5)
              : "-"}
          </div>

          <div style={{ marginTop: 20, fontSize: 22 }}>
            <strong>{o.price_eur}€</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
