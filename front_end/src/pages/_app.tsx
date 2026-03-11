import type { AppProps } from "next/app";
import { DM_Sans } from "next/font/google";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "../styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function AppContent({ Component, pageProps }: AppProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? theme === "dark" : true;
  const toggleTheme = () => setTheme(isDarkMode ? "light" : "dark");

  return (
    <main className={dmSans.className}>
      <Component {...pageProps} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </main>
  );
}

export default function App(props: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AppContent {...props} />
    </ThemeProvider>
  );
}
