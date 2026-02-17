import i18n from "@/lib/i18n.json";
import Link from "next/link";
import { CONTACT, waLink } from "@/lib/contact";
import { supabasePublic } from "@/lib/supabase";

const langs = ["fr", "en", "he"] as const;
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

  return {
    flights: flights ?? [],
    packages: packages ?? [],
  };
}

export default async function Home({
  params,
}: {
  params: { lang: string };
}) {
  const lang = langs.includes(params.lang as Lang)
    ? (params.lang as Lang)
    : "fr";

  const t = (i18n as any)[lang];
  const deals = await getDeals();

  return (
    <main className="container">
      <section className="hero">
        <h1>{t.home_title}</h1>
        <p>{t.home_subtitle}</p>

        <a
          href={waLink("Bonjour, je souhaite un devis")}
          target="_blank"
          className="btn"
        >
          WhatsApp
        </a>
      </section>

      <section className="section">
        <h2>🔥 Offres Promo</h2>

        <div className="card">
          {deals.flights.map((f: any) => (
            <div key={f.id}>
              ✈ {f.from_city} → {f.to_city} — {f.price_eur}€
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
