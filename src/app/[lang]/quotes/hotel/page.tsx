import i18n from "@/lib/i18n.json";
import { CONTACT, waLink } from "@/lib/contact";
import QuoteHotelForm from "@/components/QuoteHotelForm";

const langs = ["fr","en","he"] as const;
type Lang = typeof langs[number];

export default function HotelQuote({ params }: { params: { lang: string } }) {
  const lang = (langs.includes(params.lang as Lang) ? params.lang : "fr") as Lang;
  const t = (i18n as any)[lang];

  return (
    <main className="container section">
      <h1 className="h1" style={{fontSize:28}}>{lang==="fr"?"Devis hôtel dans le monde": lang==="he" ? "הצעת מחיר למלון בעולם" : "Worldwide Hotel Quote"}</h1>
      <p className="sub">{lang==="fr"?"Réponse rapide par WhatsApp / mail.": lang==="he" ? "מענה מהיר בוואטסאפ / אימייל." : "Fast reply via WhatsApp / email."}</p>

      <div className="hero-grid">
        <div className="card">
          <QuoteHotelForm lang={lang} />
        </div>
        <div className="card">
          <h2 style={{margin:"0 0 10px"}}>{t.contact_title}</h2>
          <a className="btn orange" href={waLink("Bonjour Aviel Travel, je souhaite un devis hôtel (monde).")}>💬 WhatsApp</a>
          <div style={{height:10}} />
          <a className="btn white" href={`tel:${CONTACT.phoneFR}`}>📞 France</a>
          <div style={{height:10}} />
          <a className="btn white" href={`mailto:${CONTACT.emailWorld}`}>✉️ Email</a>
        </div>
      </div>
    </main>
  );
}
