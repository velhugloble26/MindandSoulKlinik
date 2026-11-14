import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import EnquiryModal from "@/components/EnquiryModal";
import FloatingContactActions from "@/components/FloatingContactActions";
import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";
import InitialLogoLoader from "@/components/InitialLogoLoader";
import MobileBottomNav from "@/components/MobileBottomNav";

const ebGaramond = localFont({
  src: [
    {
      path: "./fonts/eb-garamond-latin.woff2",
      weight: "400 800",
      style: "normal",
    },
    {
      path: "./fonts/eb-garamond-latin-italic.woff2",
      weight: "400 800",
      style: "italic",
    },
  ],
  variable: "--loaded-eb-garamond",
  display: "swap",
});

const montserrat = localFont({
  src: [
    {
      path: "./fonts/montserrat-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/montserrat-latin-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--loaded-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Adore Life – Because everyone deserves to be understood",
    template: "%s | Adore Life",
  },
  description:
    "Adore Life offers individual therapy, couples therapy, and corporate wellbeing services in Thane, India. Begin your journey toward emotional clarity and self-understanding with therapist Kiran Khullar.",
  metadataBase: new URL("https://www.mindandsoulklinic.com"),
  icons: {
    icon: [{ url: "/fevicons.webp", type: "image/webp" }],
    shortcut: [{ url: "/fevicons.webp", type: "image/webp" }],
  },
  openGraph: {
    siteName: "Adore Life",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${montserrat.variable} scroll-smooth`}
    >
      <head>
        {/* Material Symbols icon font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased overflow-x-hidden"
        style={{
          fontFamily: "var(--font-body-md)",
          backgroundColor: "var(--color-background)",
          color: "var(--color-on-background)",
        }}
      >
        <InitialLogoLoader />
        <SmoothScrollProvider>
          {children}
          {/* <EnquiryModal /> */}
          <Footer />
          <FloatingContactActions />
          <MobileBottomNav />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
