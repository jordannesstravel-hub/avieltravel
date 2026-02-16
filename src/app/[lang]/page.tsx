import i18n from "@/lib/i18n.json";
import Link from "next/link";
import { CONTACT, waLink } from "@/lib/contact";
import { supabasePublic } from "@/lib/supabase";

const langs = ["fr", "en", "he"] as const;
type Lang = (typeof langs)[number];

type Offer = {
  id: number;
  title: string | null;
  route: string | null;
  trip: string | null; // "RT" | "OW"
  active: boolean | null;
  category: string | null; // "PROMO"
  price_eur: number | null;
};

async function getDeals() {
  const sb = supabasePublic();

  const { data: flights } = await sb
    .from("offers_flight")
    .select("id,title,route,trip,active,category,price_eur")
    .eq("active", true)
    .eq("category", "PROMO")
    .order("priority", { ascending: false })
    .order("price_eur", { ascending: true })
    .limit(6);

  return (flights ?? []) as Offer[];
}

function t(lang: Lang, key: keyof (typeof i18n)["fr"]) {
  // @ts-ignore
  return (i18n?.[lang]?.[key] ?? i18n?.fr?.[key] ?? key) as string;
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Lang = (langs.includes(rawLang as Lang) ? rawLang : "fr") as Lang;

  const deals = await getDeals();

  return (
    <main style={{ background: "#f6f7fb", minHeight: "100vh" }}>
      {/* HERO */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "26px 16px 10px 16px",
        }}
      >
        <div
          style={{
            borderRadius: 18,
            background: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* petit bandeau promo */}
          <div
            style={{
              padding: "10px 14px",
              background:
                "linear-gradient(90deg, rgba(255,120,80,0.95), rgba(230,90,60,0.95))",
              color: "white",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ opacity: 0.95 }}>
              🔥 {t(lang, "promos_du_moment") ?? "Promos du moment"} —{" "}
              {t(lang, "reponse_rapide_whatsapp") ?? "Réponse rapide WhatsApp"}
            </div>
            <Link
              href={`/${lang}/promos`}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "6px 10px",
                borderRadius: 10,
                fontWeight: 700,
                textDecoration: "none",
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              {t(lang, "voir") ?? "Voir"}
            </Link>
          </div>

          {/* contenu hero */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 0.9fr",
              gap: 18,
              padding: 18,
              alignItems: "stretch",
            }}
          >
            {/* gauche */}
            <div
              style={{
                borderRadius: 16,
                padding: 18,
                background:
                  "linear-gradient(180deg, rgba(240,248,255,1), rgba(255,255,255,1))",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 28,
                  lineHeight: 1.15,
                  color: "#1b2b4a",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                ✈️ {t(lang, "hero_title") ?? "Vos vols & packages Israël au meilleur prix"}
              </h1>

              <p style={{ margin: "10px 0 14px", color: "#4b5563" }}>
                {t(lang, "hero_subtitle") ??
                  "Agence discount • Rapide • Contact direct (téléphone / WhatsApp / email)"}
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href={`/${lang}/flights/tlv`}
                  style={btnStyle("#e85b3a")}
                >
                  🔎 {t(lang, "rechercher_un_vol") ?? "Rechercher un vol"}
                </Link>

                <Link
                  href={`/${lang}/promos`}
                  style={btnStyle("#d9482b", true)}
                >
                  🔥 {t(lang, "voir_les_promos") ?? "Voir les promos"}
                </Link>

                <a
                  href={waLink(CONTACT.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  style={btnStyle("#17a34a")}
                >
                  💬 {t(lang, "whatsapp_immediat") ?? "WhatsApp immédiat"}
                </a>
              </div>
            </div>

            {/* droite contact */}
            <div
              style={{
                borderRadius: 16,
                padding: 18,
                background: "white",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 8, color: "#1b2b4a" }}>
                Contact rapide
              </div>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                <div>
                  <strong>FR:</strong> {CONTACT.phone_fr}
                </div>
                <div>
                  <strong>IL:</strong> {CONTACT.phone_il}
                </div>
                <div>
                  <strong>WhatsApp:</strong> {CONTACT.whatsapp}
                </div>
                <div style={{ marginTop: 10 }}>
                  <div>
                    <strong>Email:</strong> {CONTACT.email_main}
                  </div>
                  {CONTACT.email_secondary ? (
                    <div>
                      <strong>Email 2:</strong> {CONTACT.email_secondary}
                    </div>
                  ) : null}
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a
                    href={waLink(CONTACT.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    style={miniBtn("#17a34a")}
                  >
                    WhatsApp
                  </a>
                  <a href={`tel:${CONTACT.phone_fr}`} style={miniBtn("#2563eb")}>
                    Appeler
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* séparation */}
          <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />

          {/* OFFRES PROMO */}
          <section style={{ padding: "18px 18px 6px 18px" }}>
            <h2 style={{ margin: "6px 0 14px", color: "#1b2b4a" }}>
              🔥 Offres promo disponibles
            </h2>

            {deals.length === 0 ? (
              <div style={{ color: "#6b7280", paddingBottom: 12 }}>
                Aucune promo pour le moment.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 14,
                  paddingBottom: 12,
                }}
              >
                {deals.map((o) => (
                  <Link
                    key={o.id}
                    href={`/${lang}/promos`}
                    style={{
                      textDecoration: "none",
                      background: "white",
                      borderRadius: 16,
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                      padding: 14,
                      display: "block",
                    }}
                  >
                    <div style={{ fontWeight: 900, color: "#1b2b4a", marginBottom: 8 }}>
                      {o.title ?? "Promo"}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: 14 }}>
                      {(o.route ?? "").replace("-", " → ")}{" "}
                      {o.trip === "OW" ? "(Aller simple)" : "(Aller-retour)"}
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#e85b3a",
                      }}
                    >
                      Dès {o.price_eur ?? "-"}€
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        display: "inline-block",
                        background: "#17a34a",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: 999,
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      WhatsApp
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* NOS SERVICES */}
          <section style={{ padding: "8px 18px 22px 18px" }}>
            <h2 style={{ margin: "10px 0 12px", color: "#1b2b4a" }}>
              Nos services
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {[
                { title: "Vols Paris ↔ Tel Aviv", href: `/${lang}/flights/tlv` },
                { title: "Vols Paris ↔ Eilat", href: `/${lang}/flights/eil` },
                { title: "Package Eilat (Vol + Hôtel)", href: `/${lang}/packages/eilat` },
                { title: "Devis Hôtel Monde", href: `/${lang}/hotels` },
                { title: "Devis Location Voiture", href: `/${lang}/cars` },
              ].map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  style={{
                    textDecoration: "none",
                    background: "white",
                    borderRadius: 16,
                    border: "1px solid rgba(0,0,0,0.06)",
                    padding: 14,
                    color: "#1f2937",
                    fontWeight: 800,
                    minHeight: 70,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function btnStyle(bg: string, outline = false): React.CSSProperties {
  if (outline) {
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 999,
      fontWeight: 800,
      textDecoration: "none",
      border: `2px solid ${bg}`,
      color: bg,
      background: "transparent",
    };
  }
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 999,
    fontWeight: 800,
    textDecoration: "none",
    color: "white",
    background: bg,
  };
}

function miniBtn(bg: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 900,
    textDecoration: "none",
    color: "white",
    background: bg,
    fontSize: 13,
  };
}
