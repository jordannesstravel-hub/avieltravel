import { supabasePublic } from "@/lib/supabase";
import Link from "next/link";

export default async function Flights({ searchParams }: any) {
  const from = (searchParams?.from ?? "PARIS").toUpperCase();
  const to = (searchParams?.to ?? "TLV").toUpperCase();
  const trip = searchParams?.trip ?? "RT";
  const depart = searchParams?.depart ?? "";
  const ret = searchParams?.return ?? "";

  const routekey = `${from}_${to}`;

  const sb = supabasePublic();

  let query = sb
    .from("offers_flight")
    .select("*")
    .eq("active", true)
    .eq("route", routekey);

  if (trip) query = query.eq("trip", trip);
  if (depart) query = query.eq("depart_date", depart);
  if (trip === "RT" && ret) query = query.eq("return_date", ret);

  const { data } = await query.order("price_eur", { ascending: true });

  const title =
    routekey === "TLV_PARIS"
      ? "Tel Aviv ⇄ Paris"
      : "Paris ⇄ Tel Aviv";

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

            <div>
              <div className="label">Date retour</div>
              <input
                type="date"
                name="return"
                className="input"
                defaultValue={ret}
              />
            </div>

          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn orange" type="submit">
              Voir les offres
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: 30 }}>
        {(data ?? []).length === 0 && <div>Aucune offre trouvée</div>}

        {(data ?? []).map((o: any) => (
          <div key={o.id} className="result-card">
            <div style={{ fontWeight: 600 }}>{o.title}</div>
            <div>{o.depart_date} {o.return_date ? `- ${o.return_date}` : ""}</div>
            <div style={{ marginTop: 10, fontSize: 20 }}>
              {o.price_eur}€
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
