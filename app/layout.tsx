import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hetav Group – FMCG Distributor in Mumbai",
  description:
    "Hetav Commerce LLP is an authorised FMCG distributor in Jogeshwari West, Mumbai. Reliable 48-hour delivery, GPS-tracked fleet, cold chain logistics.",
  openGraph: {
    title: "Hetav Group – FMCG Distributor in Mumbai",
    description:
      "Authorised FMCG distribution. Direct from brand warehouses. 48-hour delivery window across Mumbai.",
    url: "https://hetavgroup.com",
    siteName: "Hetav Group",
    locale: "en_IN",
    type: "website",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Hetav Commerce LLP",
  description:
    "Authorised FMCG distributor in Jogeshwari West, Mumbai. GPS-tracked fleet, cold chain, 48-hour delivery.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jogeshwari West",
    addressLocality: "Mumbai",
    postalCode: "400102",
    addressCountry: "IN",
  },
  telephone: "+918976434940",
  email: "hetavgroup@gmail.com",
  url: "https://hetavgroup.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
