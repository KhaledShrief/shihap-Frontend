import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import { ToastProvider } from "./contexts/CustomToast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Elora Store",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className="" >
        <Provider>
          <ToastProvider>
            <NavigationBar />

            {children}
            <Footer />
          </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}
