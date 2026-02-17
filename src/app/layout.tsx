import "./globals.css";

export const metadata = {
  title: "Aviel Travel",
  description: "Voyage promo — réponse rapide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
