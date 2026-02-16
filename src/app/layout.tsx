import "./globals.css";

export const metadata = {
  title: "Aviel Travel",
  description: "Voyage promo — prix discount — réponse rapide",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
