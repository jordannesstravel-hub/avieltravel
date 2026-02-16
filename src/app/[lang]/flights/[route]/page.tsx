import i18n from "@/lib/i18n.json";
import { supabasePublic } from "@/lib/supabase";
import Link from "next/link";
import { waLink, mailto, CONTACT } from "@/lib/contact";

const langs = ["fr","en","he"] as const;
type Lang = typeof langs[number];

const catList = ["PROMO","PESSAH","SUKKOT","SUMMER","WINTER","GENERAL","ALL"] as const;

export default async function Flights({ params, searchParams }: { params: { lang: string, route: string }, searchParams: any }) {
  const lang = (langs.includes(params.lang as Lang) ? params.lang : "fr") as Lang;
  const t = (i18n as any)[lang];
  const route = params.route === "eilat" ? "PARIS_EILAT" : "PARIS_TLV";

  const trip = searchParams.trip ?? "RT";
  const cat = (searchParams.cat ?? "ALL").toUpperCase();
  const depart = searchParams.depart ?? "";
  const ret = searchParams.return ?? "";

  const sb = supabasePublic();
  let q = sb.from("offers_flights").select("*").eq("active", true).in("route", route === "PARIS_TLV" ? "TLV_PARIS : PARIS_TLV");

  if (cat !== "ALL") q = q.eq("category", cat);
  if (trip) q = q.eq("trip", trip);
  if (depart) q = q.eq("depart_date", depart);
  if (trip === "RT" && ret) q = q.eq("return_date", ret);

  const { data } = await q.order("priority", { ascending: false }).order("price_eur", { ascending: true });

  const title = route === "PARIS_TLV" ? "Paris ⇄ Tel Aviv" : "Paris ⇄ Eilat";

  return (
    <main className="container section">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", flexWrap:"wrap", gap:10}}>
        <h1 className="h1" style={{fontSize:28}}>{title}</h1>
        <Link className="btn orange" href={`/${lang}/promo`}>🔥 {lang==="fr"?"Promos":"Deals"}</Link>
      </div>

      <div className="card" style={{marginTop:12}}>
        <form action="" method="get">
          <div className="form-grid">
            <div>
              <div className="label">{tripLabel(t, lang)}</div>
              <select name="trip" className="input" defaultValue={trip}>
                <option value="OW">{t.oneway}</option>
                <option value="RT">{t.roundtrip}</option>
              </select>
            </div>
            <div>
              <div className="label">{t.filter}</div>
              <select name="cat" className="input" defaultValue={cat}>
                <option value="ALL">{t.filter_all}</option>
                {catList.filter(c=>c!=="ALL").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div className="label">{t.depart}</div>
              <input name="depart" className="input" type="date" defaultValue={depart} />
            </div>
            <div>
              <div className="label">{t.return}</div>
              <input name="return" className="input" type="date" defaultValue={ret} />
            </div>
          </div>
          <div style={{marginTop:12}}>
            <button className="btn orange" type="submit">🔎 {t.see_offers}</button>
          </div>
        </form>
      </div>

      <div style={{marginTop:14}} className="small">{(data ?? []).length} {lang==="fr"?"offres trouvées":"offers found"}</div>

      <div className="result" style={{marginTop:10}}>
        {(data ?? []).map((o:any) => {
          const msg = `Bonjour Aviel Travel, je souhaite confirmer: ${title} (${o.trip}) départ ${o.depart_date}${o.return_date ? " retour "+o.return_date : ""} — ${o.price_eur}€.`;
          const subject = `Demande - Vol ${title} - ${o.depart_date}${o.return_date ? " / "+o.return_date : ""}`;
          const body = `${msg}\n\nPassagers: ...\nNom: ...\nTéléphone: ...`;
          return (
            <div key={o.id} className="result-card">
              <div className="result-top">
                <div>
                  <span className="badge">{o.category}</span>
                  <div style={{marginTop:8, fontWeight:900}}>{title}</div>
                  <div className="small">{o.trip} · {o.depart_date}{o.return_date ? ` → ${o.return_date}` : ""}</div>
                  <div className="small">{noteFor(o, lang)}</div>
                </div>
                <div>
                  <div className="price" style={{marginTop:0}}>{o.price_eur}€</div>
                  <div className="btn-row">
                    <a className="btn orange" href={waLink(msg)}>💬 WhatsApp</a>
                    <a className="btn white" href={`tel:${CONTACT.phoneFR}`}>📞</a>
                    <a className="btn white" href={mailto(CONTACT.emailIsrael, subject, body)}>✉️</a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  );
}

function noteFor(o:any, lang:string){
  if(lang==="en") return o.notes_en || "";
  if(lang==="he") return o.notes_he || "";
  return o.notes_fr || "";
}

function tripLabel(t:any, lang:string){
  return lang==="fr" ? "Type de trajet" : (lang==="he" ? "סוג נסיעה" : "Trip type");
}
