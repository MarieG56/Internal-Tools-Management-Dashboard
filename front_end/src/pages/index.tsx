import { useState } from "react";
import { useRouter } from "next/router";
import AppNavbar from "../components/AppNavbar";
import DashboardHeading from "../components/DashboardHeading";
import StatsGrid from "../components/StatsGrid";
import ToolsTable from "../components/ToolsTable";
import {
  navLinks,
  navPathMap,
  statsData,
  toolsData,
  type NavLink,
} from "../utils/dashboardData";

interface PageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function HomePage({ isDarkMode, toggleTheme }: PageProps) {
  const router = useRouter();
  const [activePage, setActivePage] = useState<NavLink>("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleTools = toolsData.filter((tool) => {
    if (!searchQuery.trim()) {
      return true;
    }
    const value = searchQuery.toLowerCase();
    return (
      (tool.name?.toLowerCase() || "").includes(value) ||
      (tool.department?.toLowerCase() || "").includes(value) ||
      (tool.status?.toLowerCase() || "").includes(value)
    );
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/tools?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
        activePage={activePage}
        onPageChange={(page) => {
          setActivePage(page);
          void router.push(navPathMap[page]);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Search in tools catalog..."
      />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <DashboardHeading isDarkMode={isDarkMode} />
        <StatsGrid stats={statsData} isDarkMode={isDarkMode} />
        <ToolsTable tools={visibleTools} isDarkMode={isDarkMode} />
      </main>
    </div>
  );
}
