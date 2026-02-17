import i18n from "@/lib/i18n.json";
import Link from "next/link";
import { CONTACT, waLink } from "@/lib/contact";
import { supabasePublic } from "@/lib/supabase";

const langs = ["fr","en","he"] as const;
type Lang = typeof langs[number];

async function getDeals() {
  const sb = supabasePublic();
  const { data: flights } = await sb
    .from("offers_flights")
    .select("*")
    .eq("active", true)
    .eq("category", "PROMO")
    .order("priority", { ascending: false })
    .order("price_eur", { ascending: true })
    .limit(3);

  const { data: packages } = await sb
    .from("offers_packages")
    .select("*")
    .eq("active", true)
    .eq("category", "PROMO")
    .order("priority", { ascending: false })
    .order("price_eur", { ascending: true })
    .limit(2);

  return { flights: flights ?? [], packages: packages ?? [] };
}

export default async function Home({ params }: { params: { lang: string } }) {
  const lang = (langs.includes(params.lang as Lang) ? params.lang : "fr") as Lang;
  const t = (i18n as any)[lang];
  const deals = await getDeals();

  return (
    <><div style={{ padding: 20 blackground : "yelow", frontWeight: "bold" }}>
      Test HOMEPAGE OK
    </div>
    <main className="container">
      <section className="hero">
        <div className="hero-grid">
          <div className="card">
            <h1 className="h1">{t.hero_title}</h1>
            <p className="sub">{t.hero_sub}</p>
            <div className="btn-row">
              <Link className="btn orange" href={`/${lang}/flights/tlv`}>🔎 {t.cta_search}</Link>
              <Link className="btn white" href={`/${lang}/promo`}>🔥 {t.cta_promos}</Link>
              <a className="btn orange" href={waLink("Bonjour Aviel Travel, je veux une offre promo. / Hello, I want a deal. / שלום, אני רוצה מבצע.")}>💬 {t.cta_wa}</a>
            </div>
          </div>

          <div className="card">
            <h2 style={{margin:"0 0 10px"}}>{t.contact_title}</h2>
            <div className="small">FR: <a href={`tel:${CONTACT.phoneFR}`}>{process.env.NEXT_PUBLIC_PHONE_FR_DISPLAY ?? "01 85 43 13 75"}</a></div>
            <div className="small">IL: <a href={`tel:${CONTACT.phoneIL1}`}>+972 55 772 6027</a> · <a href={`tel:${CONTACT.phoneIL2}`}>+972 55 966 1683</a></div>
            <div className="small">WhatsApp: <a href={waLink("Bonjour Aviel Travel")}>{process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY ?? "06 11 09 07 31"}</a></div>
            <div className="small">Email Israël: <a href={`mailto:${CONTACT.emailIsrael}`}>{CONTACT.emailIsrael}</a></div>
            <div className="small">Email Devis monde: <a href={`mailto:${CONTACT.emailWorld}`}>{CONTACT.emailWorld}</a></div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>{t.deals_title}</h2>
        <div className="deals">
          {deals.flights.map((o:any) => (
            <div key={o.id} className="deal">
              <span className="badge">PROMO</span>
              <div style={{marginTop:8, fontWeight:900}}>{o.route === "PARIS_TLV" ? "Paris ⇄ Tel Aviv" : "Paris ⇄ Eilat"}</div>
              <div className="small">{o.trip === "OW" ? "OW" : "RT"} · {o.depart_date}{o.return_date ? ` → ${o.return_date}` : ""}</div>
              <div className="price">{o.price_eur}€</div>
              <a className="btn orange" href={waLink(`Bonjour Aviel Travel, offre PROMO: ${o.route} ${o.trip} départ ${o.depart_date}${o.return_date ? " retour "+o.return_date : ""}.`)}>💬 WhatsApp</a>
            </div>
          ))}
          {deals.packages.map((p:any) => (
            <div key={p.id} className="deal">
              <span className="badge">PROMO</span>
              <div style={{marginTop:8, fontWeight:900}}>Package Eilat</div>
              <div className="small">{p.hotel_name} · {p.nights}N · {p.depart_date}</div>
              <div className="price">{p.price_eur}€</div>
              <a className="btn orange" href={waLink(`Bonjour Aviel Travel, package PROMO Eilat: départ ${p.depart_date}, ${p.nights} nuits, hôtel ${p.hotel_name}.`)}>💬 WhatsApp</a>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>{t.choices_title}</h2>
        <div className="grid5">
          <Link className="tile" href={`/${lang}/flights/tlv`}>
            <h3>✈️ {t.menu.tlv}</h3><p>Paris ⇄ TLV</p>
          </Link>
          <Link className="tile" href={`/${lang}/flights/eilat`}>
            <h3>🏖 {t.menu.eilat}</h3><p>Paris ⇄ Eilat</p>
          </Link>
          <Link className="tile" href={`/${lang}/packages/eilat`}>
            <h3>🏨 {t.menu.pkg}</h3><p>Vol + Hôtel</p>
          </Link>
          <Link className="tile" href={`/${lang}/quotes/hotel`}>
            <h3>🌍 {t.menu.hotel}</h3><p>Sur demande</p>
          </Link>
          <Link className="tile" href={`/${lang}/quotes/car`}>
            <h3>🚗 {t.menu.car}</h3><p>Sur demande</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>{t.why_title}</h2>
        <div className="card">
          <ul style={{margin:0, paddingInlineStart: rtlListPad(lang), lineHeight:1.9}}>
            {t.why_points.map((x:string, i:number) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}

function rtlListPad(lang:string){
  return lang==="he" ? "18px" : "20px";
}
