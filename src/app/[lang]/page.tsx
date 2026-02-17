import i18n from "@/lib/i18n.json";
import Link from "next/link";
import { CONTACT, walink } from "@/lib/contact";
import { supabasePublic } from "@/lib/supabase";

const langs = ["fr", "en", "he"] as const;
type Lang = (typeof langs)[number];

type OfferFlight = any;
type OfferPackage = any;

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
  const lang: Lang = langs.includes(params.lang as Lang) ? (params.lang as Lang) : "fr";
  const t: any = (i18n as any)[lang];

  const deals = await getDeals();

  return (
    <main className="container">
      {/* HERO */}
      <section className="hero">
        <div className="heroInner">
          <div className="heroLeft">
            <h1>{t?.home_title ?? "Vos vols & packages Israël au meilleur prix"}</h1>
            <p className="muted">
              {t?.home_subtitle ?? "Agence discount spécialisée Israël • Réponse rapide téléphone ou WhatsApp"}
            </p>

            <div className="heroBtns">
              <Link className="btn" href={`/${lang}/flights`}>
                {t?.cta_search_flight ?? "Rechercher un vol"}
              </Link>

              <Link className="btn btnGhost" href={`/${lang}/promo`}>
                {t?.cta_promos ?? "Voir les promos"}
              </Link>

              <a className="btn btnWhats" href={walink("Bonjour, je souhaite un devis")} target="_blank" rel="noreferrer">
                WhatsApp immédiat
              </a>
            </div>

            <div className="miniNote">
              {t?.note ?? "Réponse rapide • Prix compétitifs • Assistance avant / pendant / après"}
            </div>
          </div>

          <div className="heroRight">
            <div className="contactCard">
              <h3>{t?.contact_fast ?? "Contact rapide"}</h3>
              <div className="small">
                <div><b>FR</b> : {CONTACT?.fr_phone ?? "—"}</div>
                <div><b>IL</b> : {CONTACT?.il_phone ?? "—"}</div>
                <div className="spacer" />
                <div>{CONTACT?.email_israel ? <>Email Israël: {CONTACT.email_israel}</> : null}</div>
                <div>{CONTACT?.email_world ? <>Email Devis monde: {CONTACT.email_world}</> : null}</div>
              </div>
              <a className="btn btnFull" href={walink("Bonjour, je souhaite un devis")} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOS */}
      <section className="section">
        <h2>🔥 {t?.promo_title ?? "Offres Promo Disponibles"}</h2>

        <div className="grid2">
          <div className="card">
            <h3>{t?.promo_flights ?? "Vols"}</h3>
            <ul style={{ margin: 0, paddingInlineStart: rtlListPad(lang), lineHeight: 1.9 }}>
              {(deals.flights as OfferFlight[]).length ? (
                (deals.flights as OfferFlight[]).map((x: any, i: number) => (
                  <li key={i}>
                    {x?.from_city ?? "Paris"} → {x?.to_city ?? "Tel Aviv"}{" "}
                    {x?.price_eur ? <>— dès {x.price_eur}€</> : null}
                  </li>
                ))
              ) : (
                <>
                  <li>Paris → Tel Aviv — dès 399€</li>
                  <li>Paris → Eilat — dès 449€</li>
                </>
              )}
            </ul>

            <Link className="btn btnGhost" href={`/${lang}/flights`}>
              {t?.see_more ?? "Voir plus"}
            </Link>
          </div>

          <div className="card">
            <h3>{t?.promo_packages ?? "Packages"}</h3>
            <ul style={{ margin: 0, paddingInlineStart: rtlListPad(lang), lineHeight: 1.9 }}>
              {(deals.packages as OfferPackage[]).length ? (
                (deals.packages as OfferPackage[]).map((x: any, i: number) => (
                  <li key={i}>
                    {x?.title ?? "Package"}{" "}
                    {x?.price_eur ? <>— dès {x.price_eur}€</> : null}
                  </li>
                ))
              ) : (
                <>
                  <li>Tel Aviv + Hôtel (3 nuits) — dès 699€</li>
                  <li>Eilat + Hôtel (4 nuits) — dès 799€</li>
                </>
              )}
            </ul>

            <Link className="btn btnGhost" href={`/${lang}/packages`}>
              {t?.see_more ?? "Voir plus"}
            </Link>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section">
        <h2>{t?.why_title ?? "Pourquoi Aviel Travel ?"}</h2>
        <div className="card">
          <ul style={{ margin: 0, paddingInlineStart: rtlListPad(lang), lineHeight: 1.9 }}>
            {(t?.why_points ?? ["Réponse rapide", "Prix discount", "Assistance complète"]).map((x: string, i: number) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <style jsx>{`
        .container {
          max-width: 1050px;
          margin: 0 auto;
          padding: 22px 16px 60px;
        }
        .hero {
          background: linear-gradient(180deg, rgba(10,92,255,.10), rgba(255,255,255,0));
          border-radius: 18px;
          padding: 18px;
          border: 1px solid rgba(0,0,0,.06);
        }
        .heroInner {
          display: grid;
          grid-template-columns: 1.5fr 0.9fr;
          gap: 16px;
          align-items: start;
        }
        .heroLeft h1 {
          margin: 0 0 8px;
          font-size: 34px;
          line-height: 1.15;
        }
        .muted {
          margin: 0 0 14px;
          opacity: .8;
        }
        .heroBtns {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin: 10px 0 10px;
        }
        .miniNote {
          margin-top: 8px;
          font-size: 13px;
          opacity: .75;
        }
        .section {
          margin-top: 18px;
        }
        .section h2 {
          margin: 0 0 10px;
          font-size: 18px;
        }
        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .card {
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 14px;
          padding: 14px;
          background: #fff;
          box-shadow: 0 6px 18px rgba(0,0,0,.04);
        }
        .contactCard h3 {
          margin: 0 0 10px;
        }
        .small {
          font-size: 13px;
          opacity: .85;
        }
        .spacer {
          height: 8px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,.12);
          text-decoration: none;
          font-weight: 600;
          background: #fff;
          cursor: pointer;
        }
        .btn:hover {
          opacity: .92;
        }
        .btnGhost {
          background: transparent;
        }
        .btnWhats {
          border-color: rgba(0,180,80,.35);
        }
        .btnFull {
          margin-top: 12px;
          width: 100%;
        }
        @media (max-width: 860px) {
          .heroInner {
            grid-template-columns: 1fr;
          }
          .grid2 {
            grid-template-columns: 1fr;
          }
          .heroLeft h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  );
}

function rtlListPad(lang: string) {
  return lang === "he" ? "18px" : "20px";
}
