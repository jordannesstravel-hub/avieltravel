import i18n from "@/lib/i18n.json";
import { supabasePublic } from "@/lib/supabase";
import { waLink, mailto, CONTACT } from "@/lib/contact";

const langs = ["fr","en","he"] as const;
type Lang = typeof langs[number];

export default async function Packages({ params, searchParams }: { params: { lang: string }, searchParams: any }) {
  const lang = (langs.includes(params.lang as Lang) ? params.lang : "fr") as Lang;
  const t = (i18n as any)[lang];

  const cat = (searchParams.cat ?? "ALL").toUpperCase();
  const depart = searchParams.depart ?? "";
  const nights = searchParams.nights ?? "";

  const sb = supabasePublic();
  let q = sb.from("offers_packages").select("*").eq("active", true);

  if (cat !== "ALL") q = q.eq("category", cat);
  if (depart) q = q.eq("depart_date", depart);
  if (nights) q = q.eq("nights", Number(nights));

  const { data } = await q.order("priority", { ascending: false }).order("price_eur", { ascending: true });

  return (
    <main className="container section">
      <h1 className="h1" style={{fontSize:28}}>Package Vol + Hôtel — Paris ⇄ Eilat</h1>

      <div className="card" style={{marginTop:12}}>
        <form action="" method="get">
          <div className="form-grid">
            <div>
              <div className="label">{t.filter}</div>
              <select name="cat" className="input" defaultValue={cat}>
                <option value="ALL">{t.filter_all}</option>
                <option value="PROMO">PROMO</option>
                <option value="PESSAH">PESSAH</option>
                <option value="SUKKOT">SUKKOT</option>
                <option value="SUMMER">SUMMER</option>
                <option value="WINTER">WINTER</option>
                <option value="GENERAL">GENERAL</option>
              </select>
            </div>
            <div>
              <div className="label">{t.depart}</div>
              <input name="depart" className="input" type="date" defaultValue={depart} />
            </div>
            <div>
              <div className="label">{t.nights}</div>
              <select name="nights" className="input" defaultValue={nights}>
                <option value="">{lang==="fr"?"Tous":"All"}</option>
                {[3,4,5,7,10,14].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginTop:12}}>
            <button className="btn orange" type="submit">🔎 {t.see_packages}</button>
          </div>
        </form>
      </div>

      <div style={{marginTop:14}} className="small">{(data ?? []).length} {lang==="fr"?"packages trouvés":"packages found"}</div>

      <div className="result" style={{marginTop:10}}>
        {(data ?? []).map((p:any) => {
          const msg = `Bonjour Aviel Travel, je souhaite confirmer un package Eilat: départ ${p.depart_date}, ${p.nights} nuits, hôtel ${p.hotel_name} (${p.board ?? ""}) — ${p.price_eur}€.`;
          const subject = `Demande - Package Eilat - ${p.depart_date} - ${p.nights}N`;
          const body = `${msg}\n\nPassagers: ...\nNom: ...\nTéléphone: ...`;
          return (
            <div key={p.id} className="result-card">
              <div className="result-top">
                <div>
                  <span className="badge">{p.category}</span>
                  <div style={{marginTop:8, fontWeight:900}}>{p.hotel_name}</div>
                  <div className="small">{p.nights}N · {p.board ?? ""} · {p.depart_date}</div>
                  <div className="small">{lang==="en"? (p.notes_en||"") : lang==="he" ? (p.notes_he||"") : (p.notes_fr||"")}</div>
                </div>
                <div>
                  <div className="price" style={{marginTop:0}}>{p.price_eur}€</div>
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
