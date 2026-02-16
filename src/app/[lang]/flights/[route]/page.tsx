import { createClient } from "@/utils/supabase/server";

export default async function Page({ params }: any) {
  const supabase = createClient();

  const { data: offers, error } = await supabase
    .from("offers_flight")
    .select("*")
    .order("priority", { ascending: true });

  if (error) {
    return <div>Erreur chargement offres</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      {offers?.map((o: any) => (
        <div
          key={o.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h2>{o.title}</h2>

          <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {o.price}€
          </div>

          <div>
            <strong>Compagnie :</strong> {o.ailine || "-"}
          </div>

          <div>
            <strong>Bagage cabine :</strong> {o.cabin_bag || "-"}
          </div>

          <div>
            <strong>Bagage soute :</strong> {o.checked_bag || "-"}
          </div>

          <div style={{ marginTop: 15 }}>
            <strong>Aller</strong>
            <br />
            Départ :{" "}
            {o.depart_time ? String(o.depart_time).slice(0, 5) : "-"}
            <br />
            Arrivée :{" "}
            {o.arrive_time ? String(o.arrive_time).slice(0, 5) : "-"}
          </div>

          <div style={{ marginTop: 15 }}>
            <strong>Retour</strong>
            <br />
            Départ :{" "}
            {o.return_depart_time
              ? String(o.return_depart_time).slice(0, 5)
              : "-"}
            <br />
            Arrivée :{" "}
            {o.return_arrive_time
              ? String(o.return_arrive_time).slice(0, 5)
              : "-"}
          </div>
        </div>
      ))}
    </div>
  );
}
