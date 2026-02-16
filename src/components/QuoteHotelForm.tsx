"use client";
import { useState } from "react";
import i18n from "@/lib/i18n.json";
import { supabasePublic } from "@/lib/supabase";

export default function QuoteHotelForm({ lang }: { lang: "fr"|"en"|"he" }) {
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
    const { error } = await sb.from("leads").insert({ type: "HOTEL_QUOTE", lang, payload });
    setLoading(false);
    if (error) setOk(lang==="fr" ? "Erreur, réessaie." : lang==="he" ? "שגיאה, נסו שוב." : "Error, please try again.");
    else setOk(lang==="fr" ? "Demande envoyée ✅" : lang==="he" ? "הבקשה נשלחה ✅" : "Request sent ✅");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="label">{t.destination}</div>
      <input className="input" name="destination" required />

      <div className="form-grid">
        <div>
          <div className="label">{t.arrive}</div>
          <input className="input" type="date" name="checkin" />
        </div>
        <div>
          <div className="label">{t.leave}</div>
          <input className="input" type="date" name="checkout" />
        </div>
      </div>

      <div className="form-grid">
        <div>
          <div className="label">{lang==="fr"?"Adultes":"Adults"}</div>
          <input className="input" type="number" name="adults" min="1" defaultValue="2" />
        </div>
        <div>
          <div className="label">{lang==="fr"?"Enfants":"Children"}</div>
          <input className="input" type="number" name="children" min="0" defaultValue="0" />
        </div>
      </div>

      <div className="label">{t.budget}</div>
      <input className="input" name="budget" />

      <div className="label">{t.notes}</div>
      <textarea className="input" name="notes" rows={4} />

      <div style={{marginTop:12}}>
        <button className="btn orange" disabled={loading} type="submit">{loading ? "..." : `🟠 ${t.form_send}`}</button>
      </div>

      {ok && <div className="small" style={{marginTop:10}}>{ok}</div>}
    </form>
  );
}
