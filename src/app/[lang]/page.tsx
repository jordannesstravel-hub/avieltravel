import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative">
        {/* Background image */}
        <div
          className="h-[360px] sm:h-[420px] md:h-[520px] w-full bg-center bg-cover"
          style={{ backgroundImage: "url(/hero.jpg)" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/35 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0">
          <div className="mx-auto max-w-6xl px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
                <span className="text-2xl">✈️</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                  Vos vols &amp; packages <br />
                  Israël au meilleur prix
                </h1>
              </div>

              <p className="mt-3 text-white/90 text-sm sm:text-base">
                Agence discount spécialisée Israël • Réponse rapide téléphone ou WhatsApp
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/fr/flights/tlv"
                  className="inline-flex items-center justify-center rounded-md bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 transition"
                >
                  Rechercher un vol
                </Link>

                <Link
                  href="/fr/promos"
                  className="inline-flex items-center justify-center rounded-md bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700 transition"
                >
                  Voir les promos
                </Link>

                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600 transition"
                >
                  WhatsApp immédiat
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOS */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold text-blue-900">
          <span>🔥</span> Offres Promo Disponibles
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <PromoCard
            title="Paris → Tel Aviv"
            price="Dès 399€"
            img="/promo-tlv.jpg"
            cta="WhatsApp"
            href="https://wa.me/"
          />
          <PromoCard
            title="Paris → Eilat"
            price="Dès 449€"
            img="/promo-eilat.jpg"
            cta="WhatsApp"
            href="https://wa.me/"
          />
          <PromoCard
            title="Package Eilat"
            price="Dès 799€"
            subtitle="4 nuits / Vol + Hôtel"
            img="/promo-package.jpg"
            cta="WhatsApp"
            href="https://wa.me/"
          />
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-center text-2xl font-extrabold text-blue-900">Nos Services</h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard title="Vols Paris ~ Tel Aviv" img="/srv-1.jpg" />
          <ServiceCard title="Vols Paris ~ Eilat" img="/srv-2.jpg" />
          <ServiceCard title="Package Eilat Vol + Hôtel" img="/srv-3.jpg" />
          <ServiceCard title="Devis Location de Voiture" img="/srv-4.jpg" />
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-gray-50 border-t">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold text-blue-900">
            Pourquoi choisir Aviel Travel ?
          </h2>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <WhyCard title="Prix discount toute l’année" icon="💰" />
            <WhyCard title="Spécialiste Israël" icon="✈️" />
            <WhyCard title="Réponse rapide & efficace" icon="⚡" />
            <WhyCard title="Contact direct humain" icon="📞" />
            <WhyCard title="Offres Pessah • Été • Souccot" icon="🔥" />
            <WhyCard title="WhatsApp / Téléphone / Email" icon="💬" />
          </div>
        </div>
      </section>

      {/* CONTACT BAR */}
      <section className="bg-orange-500">
        <div className="mx-auto max-w-6xl px-4 py-8 text-white">
          <h3 className="text-center text-xl font-extrabold">
            Besoin d’une réponse rapide ?
          </h3>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-white/10 p-4">
              <div className="font-bold">📞 France</div>
              <div className="mt-1">01 85 43 13 75</div>
            </div>

            <div className="rounded-lg bg-white/10 p-4">
              <div className="font-bold">📞 Israël</div>
              <div className="mt-1">+972 55 772 60 27</div>
            </div>

            <div className="rounded-lg bg-white/10 p-4">
              <div className="font-bold">✉️ Email</div>
              <div className="mt-1 break-all">jordan.nesstravel@gmail.com</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/** Components */

function PromoCard({
  title,
  price,
  img,
  href,
  cta,
  subtitle,
}: {
  title: string;
  price: string;
  img: string;
  href: string;
  cta: string;
  subtitle?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border shadow-sm bg-white">
      <div
        className="h-44 w-full bg-center bg-cover"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="p-5">
        <div className="text-lg font-extrabold text-blue-900">{title}</div>
        {subtitle ? <div className="text-sm text-gray-600 mt-1">{subtitle}</div> : null}
        <div className="mt-2 text-2xl font-extrabold text-orange-600">{price}</div>

        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 transition"
        >
          {cta}
        </a>
      </div>
    </div>
  );
}

function ServiceCard({ title, img }: { title: string; img: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div
        className="h-36 w-full bg-center bg-cover"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="p-4 text-center">
        <div className="font-bold text-blue-900">{title}</div>
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

function WhyCard({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-bold text-blue-900">{title}</div>
    </div>
  );
}
