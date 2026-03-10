"use client";

import { useState } from "react";
import AppNavbar from "../components/AppNavbar";
import DashboardHeading from "../components/DashboardHeading";
import StatsGrid from "../components/StatsGrid";
import ToolsTable from "../components/ToolsTable";
import { navLinks, statsData, toolsData, type NavLink } from "../data/dashboardData";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePage, setActivePage] = useState<NavLink>("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleTools = toolsData.filter((tool) => {
    if (!searchQuery.trim()) {
      return true;
    }
    const value = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(value) ||
      tool.department.toLowerCase().includes(value) ||
      tool.status.toLowerCase().includes(value)
    );
  });

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
        onToggleTheme={() => setIsDarkMode((value) => !value)}
        navLinks={navLinks}
        activePage={activePage}
        onPageChange={setActivePage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <DashboardHeading isDarkMode={isDarkMode} />
        <StatsGrid stats={statsData} isDarkMode={isDarkMode} />
        <ToolsTable tools={visibleTools} isDarkMode={isDarkMode} />
      </main>
    </div>
  );
}
