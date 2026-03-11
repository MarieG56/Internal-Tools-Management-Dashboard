import { useState } from "react";
import { useRouter } from "next/router";
import AppNavbar from "../components/AppNavbar";
import { navLinks, navPathMap } from "../utils/dashboardData";

interface PageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function AnalyticsPage({ isDarkMode, toggleTheme }: PageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode
          ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:44px_44px] bg-[#121218]"
          : "bg-[#f4f4f5]"
      }`}
    >
      <AppNavbar
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        navLinks={navLinks}
        activePage="Analytics"
        onPageChange={(page) => void router.push(navPathMap[page])}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search metrics, insights..."
      />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div
          className={`rounded-2xl border p-8 ${isDarkMode ? "border-white/10 bg-[#0b0b0f] text-zinc-400" : "border-zinc-200 bg-white text-zinc-600"}`}
        >
          Analytics page foundation ready for Jour 8.
        </div>
      </main>
    </div>
  );
}
