import Link from "next/link";

export default function Home({ params }: { params: { lang: string } }) {
  const lang = params?.lang || "fr";

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
      <section
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.15 }}>
              Vos vols & packages Israël au meilleur prix
            </h1>
            <p style={{ marginTop: 10, color: "#555" }}>
              Agence discount spécialisée Israël • Réponse rapide téléphone / WhatsApp
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
              <Link
                href={`/${lang}/flights`}
                style={{
                  background: "#f59e0b",
                  color: "white",
                  padding: "10px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Rechercher un vol
              </Link>

              <Link
                href={`/${lang}/promo`}
                style={{
                  background: "white",
                  color: "#f59e0b",
                  padding: "10px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                  border: "1px solid rgba(245,158,11,0.5)",
                }}
              >
                Voir les promos
              </Link>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#22c55e",
                  color: "white",
                  padding: "10px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                WhatsApp immédiat
              </a>
            </div>
          </div>

          <div
            style={{
              minWidth: 260,
              background: "#f8fafc",
              borderRadius: 14,
              padding: 16,
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 10 }}>Contact rapide</h3>
            <p style={{ margin: "6px 0", color: "#333" }}>FR: 01 xx xx xx xx</p>
            <p style={{ margin: "6px 0", color: "#333" }}>IL: +972 xx xxx xxxx</p>
            <p style={{ margin: "6px 0", color: "#333" }}>WhatsApp: 06 xx xx xx xx</p>
            <p style={{ margin: "6px 0", color: "#333" }}>Email: contact@avieltravel.com</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ marginBottom: 10 }}>🔥 Offres promo disponibles</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          <div style={{ background: "white", borderRadius: 14, padding: 16, border: "1px solid rgba(0,0,0,0.06)" }}>
            <b>Paris → Tel Aviv</b>
            <div style={{ marginTop: 6, color: "#555" }}>Dès 399€</div>
          </div>

          <div style={{ background: "white", borderRadius: 14, padding: 16, border: "1px solid rgba(0,0,0,0.06)" }}>
            <b>Paris → Eilat</b>
            <div style={{ marginTop: 6, color: "#555" }}>Dès 449€</div>
          </div>
        </div>
      </section>
    </main>
  );
}
