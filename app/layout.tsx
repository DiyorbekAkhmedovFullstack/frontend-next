import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StudiWelt - Your Gateway to Knowledge",
  description: "Everything you need for successful journey through german higher education. Find resources, connect with students, and navigate your path to studying in Germany.",
  keywords: ["study in germany", "studienkolleg", "university", "german education", "international students"],
  authors: [{ name: "StudiWelt Team" }],
  openGraph: {
    title: "StudiWelt - Your Gateway to Knowledge",
    description: "Everything you need for successful journey through german higher education",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__API_URL__ = ${JSON.stringify(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')};`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <I18nProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
