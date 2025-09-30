import ConditionalComponents from "@/components/ui/ConditionalComponents";
import MobileRedirect from "@/components/ui/MobileRedirect";
import "@/css/font.css";
import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "lenis/dist/lenis.css";

const HarmondVariable = localFont({
  src: "../../../public/fonts/Harmond/Harmond-VF.ttf",
  variable: "--font-harmond",
  display: "swap",
});

const RobotoFlexVariable = Roboto_Flex({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  display: "swap",
});

const DSEG = localFont({
  src: "../../../public/fonts/DSEG/DSEG7Modern-Light.ttf",
  variable: "--font-dseg-light",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RARE Studio",
  alternates: {
    canonical: "https://www.raredesignlabs.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${HarmondVariable.variable} ${RobotoFlexVariable.variable} ${DSEG.variable} scrollbar-none`}
    >
      {/* <body className="bg-[#000] font-roboto-flex text-white smooth-container w-screen max-h-[100svh] md:!max-h-screen overflow-hidden"> */}
      <body className="bg-[#000] font-roboto-flex text-white smooth-container w-screen max-md:max-h-[100svh]">
        <MobileRedirect>
          <ConditionalComponents>{children}</ConditionalComponents>
        </MobileRedirect>
      </body>
    </html>
  );
}
