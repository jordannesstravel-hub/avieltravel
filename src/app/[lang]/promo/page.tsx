import i18n from "@/lib/i18n.json";
import { supabasePublic } from "@/lib/supabase";
import { waLink } from "@/lib/contact";

const langs = ["fr","en","he"] as const;
type Lang = typeof langs[number];

export default async function Promo({ params }: { params: { lang: string } }) {
  const lang = (langs.includes(params.lang as Lang) ? params.lang : "fr") as Lang;
  const t = (i18n as any)[lang];
  const sb = supabasePublic();

  const { data: flights } = await sb
    .from("offers_flights")
    .select("*")
    .eq("active", true)
    .eq("category", "PROMO")
    .order("priority", { ascending: false })
    .order("price_eur", { ascending: true });

  const { data: packages } = await sb
    .from("offers_packages")
    .select("*")
    .eq("active", true)
    .eq("category", "PROMO")
    .order("priority", { ascending: false })
    .order("price_eur", { ascending: true });

  return (
    <main className="container section">
      <h1 className="h1" style={{fontSize:28}}>{t.deals_title}</h1>

      <div className="result">
        {(flights ?? []).map((o:any) => (
          <div key={o.id} className="result-card">
            <div className="result-top">
              <div>
                <span className="badge">PROMO</span>
                <div style={{marginTop:8, fontWeight:900}}>{o.route === "PARIS_TLV" ? "Paris ⇄ Tel Aviv" : "Paris ⇄ Eilat"}</div>
                <div className="small">{o.trip} · {o.depart_date}{o.return_date ? ` → ${o.return_date}` : ""}</div>
              </div>
              <div>
                <div className="price" style={{marginTop:0}}>{o.price_eur}€</div>
                <a className="btn orange" href={waLink(`Bonjour Aviel Travel, PROMO: ${o.route} ${o.trip} ${o.depart_date}${o.return_date ? " "+o.return_date : ""}`)}>💬 WhatsApp</a>
              </div>
            </div>
          </div>
        ))}

        {(packages ?? []).map((p:any) => (
          <div key={p.id} className="result-card">
            <div className="result-top">
              <div>
                <span className="badge">PROMO</span>
                <div style={{marginTop:8, fontWeight:900}}>Package Eilat — {p.hotel_name}</div>
                <div className="small">{p.nights}N · {p.board ?? ""} · {p.depart_date}</div>
              </div>
              <div>
                <div className="price" style={{marginTop:0}}>{p.price_eur}€</div>
                <a className="btn orange" href={waLink(`Bonjour Aviel Travel, package PROMO Eilat: départ ${p.depart_date}, ${p.nights} nuits, hôtel ${p.hotel_name}.`)}>💬 WhatsApp</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
