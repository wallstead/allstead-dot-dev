import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://allstead.dev"),
  title: "Willis Allstead",
  description:
    "Director of Curriculum Engineering at CharacterStrong. Building Bonsave on the side.",
  openGraph: {
    title: "Willis Allstead",
    description:
      "Director of Curriculum Engineering at CharacterStrong. Building Bonsave on the side.",
    url: "https://allstead.dev",
    siteName: "Willis Allstead",
    type: "website",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Willis Allstead",
  url: "https://allstead.dev",
  jobTitle: "Director of Curriculum Engineering",
  worksFor: {
    "@type": "Organization",
    name: "CharacterStrong",
    url: "https://characterstrong.com",
  },
  sameAs: [
    "https://github.com/wallstead",
    "https://www.linkedin.com/in/willallstead/",
    "https://willisallstead.substack.com",
  ],
  owns: {
    "@type": "SoftwareApplication",
    name: "Bonsave",
    url: "https://www.bonsave.app",
    applicationCategory: "FinanceApplication",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="zNfUAsgjRqff4VD5j/ytqQ"
          async
        />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
