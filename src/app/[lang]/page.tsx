import Link from "next/link";
import i18n from "@/lib/i18n.json";
import { CONTACT, waLink } from "@/lib/contact";

const langs = ["fr", "en", "he"] as const;
type Lang = (typeof langs)[number];

export default function HomePage({ params }: { params: { lang: string } }) {
  const lang = (langs.includes(params.lang as Lang) ? params.lang : "fr") as Lang;
  const t = (i18n as any)[lang];
  const rtl = lang === "he";

  return (
    <main className={`min-h-screen bg-white ${rtl ? "rtl" : ""}`}>
      {/* HERO */}
      <section className="relative">
        {/* background */}
        <div
          className="h-[340px] sm:h-[420px] md:h-[520px] w-full bg-center bg-cover"
          style={{ backgroundImage: "url(/hero.jpg)" }}
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/75 via-blue-900/35 to-transparent" />

        {/* content */}
        <div className="absolute inset-0">
          <div className="mx-auto max-w-6xl px-4 h-full flex items-center">
            <div className="w-full">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/90 text-white px-4 py-2 text-sm shadow">
                🔥 {t.banner}
              </div>

              <h1 className="mt-4 text-white text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                {t.heroTitle}
              </h1>

              <p className="mt-3 text-white/90 max-w-2xl">
                {t.heroSub}
              </p>

              {/* buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/${lang}/flights/tlv`}
                  className="rounded-xl bg-orange-500 text-white px-5 py-3 font-semibold shadow hover:opacity-90"
                >
                  ✈️ {t.ctaSearch}
                </Link>

                <Link
                  href={`/${lang}/promo`}
                  className="rounded-xl bg-white/95 text-blue-900 px-5 py-3 font-semibold shadow hover:bg-white"
                >
                  🔥 {t.ctaPromo}
                </Link>

                <a
                  href={waLink("Bonjour Aviel Travel, je souhaite une réponse rapide.")}
                  className="rounded-xl bg-green-600 text-white px-5 py-3 font-semibold shadow hover:opacity-90"
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 -mt-14 pb-14">
        <div className="grid md:grid-cols-3 gap-4">
          {/* main card */}
          <div className="md:col-span-2 rounded-2xl bg-white shadow-lg border p-5">
            <h2 className="text-xl font-bold">{t.sectionTitle}</h2>
            <p className="text-gray-600 mt-2">{t.sectionText}</p>

            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border p-4">
                <div className="font-semibold">Paris → Tel Aviv</div>
                <div className="text-gray-600">{t.from} 399€</div>
                <a
                  className="inline-block mt-2 text-blue-700 font-semibold"
                  href={waLink("Bonjour Aviel Travel, je veux un prix pour Paris → Tel Aviv")}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp →
                </a>
              </div>

              <div className="rounded-xl border p-4">
                <div className="font-semibold">Paris → Eilat</div>
                <div className="text-gray-600">{t.from} 449€</div>
                <a
                  className="inline-block mt-2 text-blue-700 font-semibold"
                  href={waLink("Bonjour Aviel Travel, je veux un prix pour Paris → Eilat")}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp →
                </a>
              </div>
            </div>
          </div>

          {/* contact card */}
          <div className="rounded-2xl bg-white shadow-lg border p-5">
            <h3 className="text-lg font-bold">{t.quickContact}</h3>

            <div className="mt-3 text-sm text-gray-700 space-y-2">
              <div>📞 FR : <a className="text-blue-700" href={`tel:${CONTACT.phoneFR}`}>{CONTACT.phoneFR}</a></div>
              <div>📞 IL : <a className="text-blue-700" href={`tel:${CONTACT.phoneIL1}`}>{CONTACT.phoneIL1}</a></div>
              <div>💬 WhatsApp : <a className="text-blue-700" href={waLink("Bonjour Aviel Travel")} target="_blank" rel="noreferrer">ouvrir</a></div>
              <div>✉️ Israel : <span className="text-gray-600">{CONTACT.emailIsrael}</span></div>
              <div>✉️ Monde : <span className="text-gray-600">{CONTACT.emailWorld}</span></div>
            </div>

            <a
              href={waLink("Bonjour Aviel Travel, je souhaite une réponse rapide.")}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block text-center rounded-xl bg-orange-500 text-white px-4 py-3 font-semibold shadow hover:opacity-90"
            >
              Réponse rapide WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
