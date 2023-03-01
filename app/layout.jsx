import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={inter.className}>{children}</body>
    </html>
  );
}

export const metadata = {
  generator: "Next.js",
  applicationName: "SPK Dana Kesejahteraan",
  referrer: "origin-when-cross-origin",
  keywords: ["SPK", "Dana Kesejahteraan", "Skripsi"],
  authors: [{ name: "Rezi" }],
  // themeColor: 'tomato',
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
