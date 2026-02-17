import i18n from "@/lib/i18n.json";
import Link from "next/link";
import { CONTACT, walink } from "@/lib/contact";

const langs = ["fr", "en", "he"] as const;
type Lang = (typeof langs)[number];

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang = langs.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "fr";

  const t = (i18n as any)[lang];
  const rtl = lang === "he";

  return (
    <div className={rtl ? "rtl" : ""}>
      <header className="header">
        <div className="container header-inner">
          <Link href={`/${lang}`} className="brand">
            <strong>
              AVIEL <span style={{ color: "var(--orange)" }}>TRAVEL</span>
            </strong>
          </Link>

          <nav className="nav">
            <Link href={`/${lang}/flights/tlv`}>{t.menu.tlv}</Link>
            <Link href={`/${lang}/flights/eilat`}>{t.menu.eilat}</Link>
            <Link href={`/${lang}/packages/eilat`}>
              {t.menu.pkg}
            </Link>
            <Link href={`/${lang}/quotes/hotel`}>
              {t.menu.hotel}
            </Link>
            <Link href={`/${lang}/quotes/car`}>
              {t.menu.car}
            </Link>
            <Link href={`/${lang}/promo`}>
              {t.menu.promo}
            </Link>
          </nav>

          <div className="actions">
            <a
              className="btn orange"
              href={walink("Bonjour Aviel Travel, je souhaite une réponse rapide.")}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <div className="banner">
        <div className="container banner-inner">
          <div>{t.banner}</div>
          <Link className="btn white" href={`/${lang}/promo`}>
            {lang === "fr" ? "Voir" : "View"}
          </Link>
        </div>
      </div>

      {children}

      <footer className="footer">
        <div className="container">
          <div>
            <strong>Contact</strong>
          </div>
          <div>
            FR : <a href={`tel:${CONTACT.phoneFR}`}>{CONTACT.phoneFR}</a>
          </div>
          <div>
            IL : <a href={`tel:${CONTACT.phoneIL1}`}>{CONTACT.phoneIL1}</a>
          </div>
          <div>
            WhatsApp :
            <a href={walink("Bonjour Aviel Travel")}> Écrire</a>
          </div>
          <div>
            {CONTACT.emailIsrael} • {CONTACT.emailWorld}
          </div>
        </div>
      </footer>
    </div>
  );
}
