"use client";
import { useState } from "react";
import i18n from "@/lib/i18n.json";
import { supabasePublic } from "@/lib/supabase";

export default function QuoteCarForm({ lang }: { lang: "fr"|"en"|"he" }) {
  const t:any = (i18n as any)[lang];
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const sb = supabasePublic();
    const { error } = await sb.from("leads").insert({ type: "CAR_QUOTE", lang, payload });
    setLoading(false);
    if (error) setOk(lang==="fr" ? "Erreur, réessaie." : lang==="he" ? "שגיאה, נסו שוב." : "Error, please try again.");
    else setOk(lang==="fr" ? "Demande envoyée ✅" : lang==="he" ? "הבקשה נשלחה ✅" : "Request sent ✅");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        <div>
          <div className="label">{lang==="fr"?"Pays":"Country"}</div>
          <input className="input" name="country" required />
        </div>
        <div>
          <div className="label">{lang==="fr"?"Ville":"City"}</div>
          <input className="input" name="city" required />
        </div>
      </div>

      <div className="form-grid">
        <div>
          <div className="label">{lang==="fr"?"Prise":"Pick-up"}</div>
          <input className="input" type="datetime-local" name="pickup" />
        </div>
        <div>
          <div className="label">{lang==="fr"?"Retour":"Drop-off"}</div>
          <input className="input" type="datetime-local" name="dropoff" />
        </div>
      </div>

      <div className="label">{lang==="fr"?"Catégorie (éco/SUV/7 places…)":"Category (eco/SUV/7 seats…)"}</div>
      <input className="input" name="category" />

      <div className="label">{t.notes}</div>
      <textarea className="input" name="notes" rows={4} />

      <div style={{marginTop:12}}>
        <button className="btn orange" disabled={loading} type="submit">{loading ? "..." : `🟠 ${t.form_send}`}</button>
      </div>

      {ok && <div className="small" style={{marginTop:10}}>{ok}</div>}
    </form>
  );
}
