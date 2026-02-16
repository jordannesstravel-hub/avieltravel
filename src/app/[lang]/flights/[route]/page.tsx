import { supabasePublic } from "@/lib/supabase";

export default async function Flights({ searchParams }: any) {
  const from = (searchParams?.from ?? "PARIS").toUpperCase();
  const to = (searchParams?.to ?? "TLV").toUpperCase();

  // OW = aller simple, RT = aller-retour
  const trip = (searchParams?.trip ?? "RT").toUpperCase(); // "OW" | "RT"

  const depart = searchParams?.depart ?? "";
  const ret = searchParams?.return ?? ""; // peut être vide si OW

  const routekey = `${from}_${to}`;

  const sb = supabasePublic();

  let query = sb
    .from("offers_flight")
    .select("*")
    .eq("active", true)
    .eq("route", routekey);

  // On filtre par type de voyage si la colonne existe et est remplie dans tes offres
  if (trip) query = query.eq("trip", trip);

  if (depart) query = query.eq("depart_date", depart);

  // Seulement si RT
  if (trip === "RT" && ret) query = query.eq("return_date", ret);

  const { data, error } = await query.order("price_eur", { ascending: true });

  const title =
    routekey === "TLV_PARIS"
      ? "Tel Aviv → Paris"
      : routekey === "PARIS_TLV"
      ? "Paris → Tel Aviv"
      : `${from} → ${to}`;

  // Petite fonction pour afficher l'heure HH:MM
  const hhmm = (t: any) => (t ? String(t).slice(0, 5) : "--:--");

  return (
    <main className="container section">
      <h1 className="h1">{title}</h1>

      <div className="card" style={{ marginTop: 20 }}>
        <form method="get">
          <div className="form-grid">
            <div>
              <div className="label">From</div>
              <select name="from" className="input" defaultValue={from}>
                <option value="PARIS">Paris</option>
                <option value="TLV">Tel Aviv</option>
              </select>
            </div>

            <div>
              <div className="label">To</div>
              <select name="to" className="input" defaultValue={to}>
                <option value="TLV">Tel Aviv</option>
                <option value="PARIS">Paris</option>
              </select>
            </div>

            <div>
              <div className="label">Type</div>
              <select name="trip" className="input" defaultValue={trip}>
                <option value="OW">Aller simple</option>
                <option value="RT">Aller-retour</option>
              </select>
            </div>

            <div>
              <div className="label">Date départ</div>
              <input
                type="date"
                name="depart"
                className="input"
                defaultValue={depart}
              />
            </div>

            {/* Date retour seulement si RT */}
            {trip === "RT" ? (
              <div>
                <div className="label">Date retour</div>
                <input
                  type="date"
                  name="return"
                  className="input"
                  defaultValue={ret}
                />
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn orange" type="submit">
              Voir les offres
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: 30 }}>
        {error && (
          <div style={{ color: "crimson" }}>
            <b>Erreur Supabase :</b> {error.message}
          </div>
        )}

        {!error && (data ?? []).length === 0 && <div>Aucune offre trouvée</div>}

        {(data ?? []).map((o: any) => (
          <div key={o.id} className="result-card" style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{o.title}</div>

            <div style={{ marginTop: 8 }}>
              <b>Compagnie :</b> {o.airline ?? "-"}
              <br />
              <b>Bagage cabine :</b> {o.cabin_bag ?? "-"}
              <br />
              <b>Bagage soute :</b> {o.checked_bag ?? "-"}
            </div>

            <div style={{ marginTop: 12 }}>
              <b>Aller :</b>
              <br />
              Date : {o.depart_date ?? "-"}
              <br />
              Départ : {hhmm(o.depart_time)}
              <br />
              Arrivée : {hhmm(o.arrive_time)}
            </div>

            {/* Retour seulement si RT */}
            {trip === "RT" ? (
              <div style={{ marginTop: 12 }}>
                <b>Retour :</b>
                <br />
                Date : {o.return_date ?? "-"}
                <br />
                Départ : {hhmm(o.return_depart_time)}
                <br />
                Arrivée : {hhmm(o.return_arrive_time)}
              </div>
            ) : null}

            <div style={{ marginTop: 14, fontSize: 22, fontWeight: 800 }}>
              {o.price_eur}€
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
