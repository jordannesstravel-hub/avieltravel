import "../globals.css";
import i18n from "@/lib/i18n.json";
import Link from "next/link";
import { CONTACT, waLink } from "@/lib/contact";

const langs = ["fr","en","he"] as const;
type Lang = typeof langs[number];

export default function LangLayout({ children, params }: { children: React.ReactNode, params: { lang: string } }) {
  const lang = (langs.includes(params.lang as Lang) ? params.lang : "fr") as Lang;
  const t = (i18n as any)[lang];
  const rtl = lang === "he";

  return (
    <div className={rtl ? "rtl" : ""}>
      <header className="header">
        <div className="container header-inner">
          <Link href={`/${lang}`} className="brand">
            <strong>AVIEL <span style={{color:"var(--orange)"}}>TRAVEL</span> ✈️</strong>
            <span>{t.tagline}</span>
          </Link>

          <nav className="nav">
            <Link href={`/${lang}/flights/tlv`}>{t.menu.tlv}</Link>
            <Link href={`/${lang}/flights/eilat`}>{t.menu.eilat}</Link>
            <Link href={`/${lang}/packages/eilat`}>{t.menu.pkg}</Link>
            <Link href={`/${lang}/quotes/hotel`}>{t.menu.hotel}</Link>
            <Link href={`/${lang}/quotes/car`}>{t.menu.car}</Link>
            <Link href={`/${lang}/promo`}>{t.menu.promo}</Link>
            <Link href={`/admin`}>{t.menu.admin}</Link>
          </nav>

          <div className="actions">
            <a className="btn orange" href={waLink("Bonjour Aviel Travel, je souhaite une réponse rapide. / Hello Aviel Travel. / שלום Aviel Travel")}>💬 WhatsApp</a>
            <a className="btn ghost" href={`tel:${CONTACT.phoneFR}`}>📞</a>
            <div className="lang">
              {langs.map(l => (
                <Link key={l} href={`/${l}`} className={l===lang ? "active" : ""}>{l.toUpperCase()}</Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="banner">
        <div className="container banner-inner">
          <div>{t.banner}</div>
          <Link className="btn white" href={`/${lang}/promo`}>{lang==="fr"?"Voir":"View"}</Link>
        </div>
      </div>

      {children}

      <footer className="footer">
        <div className="container">
          <div style={{display:"grid", gap:8}}>
            <div><strong>Contact</strong></div>
            <div>📞 FR: <a href={`tel:${CONTACT.phoneFR}`}>{process.env.NEXT_PUBLIC_PHONE_FR_DISPLAY ?? "01 85 43 13 75"}</a></div>
            <div>📞 IL: <a href={`tel:${CONTACT.phoneIL1}`}>+972 55 772 6027</a> · <a href={`tel:${CONTACT.phoneIL2}`}>+972 55 966 1683</a></div>
            <div>💬 WhatsApp: <a href={waLink("Bonjour Aviel Travel")}>{process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY ?? "06 11 09 07 31"}</a></div>
            <div>✉️ {CONTACT.emailIsrael} · {CONTACT.emailWorld}</div>
            <div>{t.legal}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
