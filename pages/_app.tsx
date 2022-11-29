import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Quicksand } from "@next/font/google";

const quicksand = Quicksand({ weight: "300", subsets: ["latin"] });
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={quicksand.className}>
      <Component {...pageProps} />
    </div>
  );
}
