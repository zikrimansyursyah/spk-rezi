import { headers } from "next/headers";
import { Inter } from "next/font/google";

import "primereact/resources/themes/lara-light-blue/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "./globals.css";
import AppComponents from "./AppComponents";
import LayoutDashboard from "./layoutDashboard";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default async function RootLayout({ children }) {
  const headersList = headers();

  const access_token = headersList.get("access_token") ? JSON.parse(headersList.get("access_token")) : {};
  const menu = headersList.get("menu") ? JSON.parse(headersList.get("menu")) : [];

  return (
    <html lang="en">
      <head />
      <body className={`${inter.className} ${inter.variable}`}>
        <AppComponents menu={menu} accessToken={access_token}>
          <LayoutDashboard>{children}</LayoutDashboard>
        </AppComponents>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "Next.js",
  applicationName: "SPK Dana Kesejahteraan",
  referrer: "origin-when-cross-origin",
  keywords: ["SPK", "Dana Kesejahteraan", "Skripsi"],
  authors: [{ name: "Rezi" }],
  // themeColor: 'dark',
  colorScheme: "light",
  creator: "Ahmad Fahrezi",
  publisher: "Ahmad Fahrezi",
  alternates: {},
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    default: "SPK SDN 02 Duri Kepa",
    template: "%s | SPK SDN 02 Duri Kepa",
  },
};
