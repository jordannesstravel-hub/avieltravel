export const CONTACT = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Aviel Travel",
  whatsappE164: process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? "+33611090731",
  phoneFR: process.env.NEXT_PUBLIC_PHONE_FR ?? "+33185431375",
  phoneIL1: process.env.NEXT_PUBLIC_PHONE_IL1 ?? "+972557726027",
  phoneIL2: process.env.NEXT_PUBLIC_PHONE_IL2 ?? "+972559661683",
  emailIsrael: process.env.NEXT_PUBLIC_EMAIL_ISRAEL ?? "resa.isradmc@gmail.com",
  emailWorld: process.env.NEXT_PUBLIC_EMAIL_WORLD ?? "jordan.nesstravel@gmail.com",
};

export function waLink(message: string) {
  const e164 = CONTACT.whatsappE164.replace("+", "");
  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}

export function mailto(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
