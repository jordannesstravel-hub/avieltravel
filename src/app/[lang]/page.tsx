import Link from "next/link";
import i18n from "@/lib/i18n.json";

const langs = ["fr", "en", "he"] as const;
type Lang = (typeof langs)[number];

export default function HomePage({ params }: { params: { lang: string } }) {
  const lang = langs.includes(params.lang as Lang) ? (params.lang as Lang) : "fr";
  const t = (i18n as any)[lang];

  return (
    <main>
      {/* HERO */}
      <section
        className="hero"
        style={{
          backgroundImage: "url(/hero.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-sub">{t.heroSub}</p>

          <div className="hero-actions">
            <Link className="btn orange" href={`/${lang}/flights/tlv`}>
              {t.cta.searchFlight}
            </Link>
            <Link className="btn white" href={`/${lang}/promo`}>
              {t.cta.viewPromos}
            </Link>
            <a className="btn green" href={t.cta.whatsappLink}>
              WhatsApp immédiat
            </a>
          </div>
        </div>
      </section>

      {/* PROMOS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">🔥 {t.promosTitle}</h2>

          <div className="promo-grid">
            <Link className="promo-card" href={`/${lang}/flights/tlv`}>
              <div
                className="promo-img"
                style={{ backgroundImage: "url(/promo-tlv.jpg)" }}
              />
              <div className="promo-body">
                <div className="promo-name">Paris → Tel Aviv</div>
                <div className="promo-price">Dès 399€</div>
                <div className="promo-btn">WhatsApp</div>
              </div>
            </Link>

            <Link className="promo-card" href={`/${lang}/flights/eilat`}>
              <div
                className="promo-img"
                style={{ backgroundImage: "url(/promo-eilat.jpg)" }}
              />
              <div className="promo-body">
                <div className="promo-name">Paris → Eilat</div>
                <div className="promo-price">Dès 449€</div>
                <div className="promo-btn">WhatsApp</div>
              </div>
            </Link>

            <Link className="promo-card" href={`/${lang}/packages/eilat`}>
              <div
                className="promo-img"
                style={{ backgroundImage: "url(/promo-package.jpg)" }}
              />
              <div className="promo-body">
                <div className="promo-name">Package Eilat</div>
                <div className="promo-price">Dès 799€</div>
                <div className="promo-btn">WhatsApp</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t.servicesTitle}</h2>

          <div className="services-grid">
            <Link className="service-card" href={`/${lang}/flights/tlv`}>
              <div
                className="service-img"
                style={{ backgroundImage: "url(/svc-flight.jpg)" }}
              />
              <div className="service-title">Vols Paris ↔ Tel Aviv</div>
              <div className="service-btn">WhatsApp</div>
            </Link>

            <Link className="service-card" href={`/${lang}/flights/eilat`}>
              <div
                className="service-img"
                style={{ backgroundImage: "url(/svc-eilat.jpg)" }}
              />
              <div className="service-title">Vols Paris ↔ Eilat</div>
              <div className="service-btn">WhatsApp</div>
            </Link>

            <Link className="service-card" href={`/${lang}/packages/eilat`}>
              <div
                className="service-img"
                style={{ backgroundImage: "url(/svc-package.jpg)" }}
              />
              <div className="service-title">Package Eilat</div>
              <div className="service-btn">WhatsApp</div>
            </Link>

            <Link className="service-card" href={`/${lang}/quotes/hotel`}>
              <div
                className="service-img"
                style={{ backgroundImage: "url(/svc-hotel.jpg)" }}
              />
              <div className="service-title">Devis Hôtel</div>
              <div className="service-btn">WhatsApp</div>
            </Link>

            <Link className="service-card" href={`/${lang}/quotes/car`}>
              <div
                className="service-img"
                style={{ backgroundImage: "url(/svc-car.jpg)" }}
              />
              <div className="service-title">Devis Location</div>
              <div className="service-btn">WhatsApp</div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
