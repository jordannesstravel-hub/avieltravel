# Aviel Travel — site + mini-admin (starter)

Ce projet est prêt à déployer sur Vercel.  
Il contient :
- Site public trilingue: /fr /en /he (hébreu en RTL)
- Pages: Home, Vols TLV, Vols Eilat, Packages Eilat, Devis Hôtel, Devis Voiture, Promos
- Mini-admin: /admin (login Supabase + gestion basique Vols/Packages/Bannières)
- Connexion Supabase (DB + Storage)

## 1) Variables d’environnement (Vercel + local)
Crée un fichier `.env.local` en local, et configure les mêmes variables dans Vercel:

- NEXT_PUBLIC_SUPABASE_URL=...
- NEXT_PUBLIC_SUPABASE_ANON_KEY=...
- NEXT_PUBLIC_SITE_NAME=Aviel Travel
- NEXT_PUBLIC_WHATSAPP_E164=+33611090731
- NEXT_PUBLIC_PHONE_FR=+33185431375
- NEXT_PUBLIC_PHONE_IL1=+972557726027
- NEXT_PUBLIC_PHONE_IL2=+972559661683
- NEXT_PUBLIC_EMAIL_ISRAEL=resa.isradmc@gmail.com
- NEXT_PUBLIC_EMAIL_WORLD=jordan.nesstravel@gmail.com

## 2) Base Supabase
Dans Supabase -> SQL Editor, exécute le fichier:
`supabase/schema.sql`

Puis crée le bucket Storage:
`public-banners` (Public)

## 3) Lancer en local
```bash
npm install
npm run dev
```

## 4) Déployer sur Vercel
- Import Git Repository (GitHub)
- Framework: Next.js (auto)
- Ajoute les variables d’environnement
- Deploy

## Notes
Ce starter est volontairement simple. Une fois en ligne, on pourra améliorer le design, le SEO, et l’admin.
