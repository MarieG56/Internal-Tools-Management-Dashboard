import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { NavLink } from "../data/dashboardData";

interface AppNavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  navLinks: NavLink[];
  activePage: NavLink;
  onPageChange: (page: NavLink) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function AppNavbar({
  isDarkMode,
  onToggleTheme,
  navLinks,
  activePage,
  onPageChange,
  searchQuery,
  onSearchChange,
}: AppNavbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notifications = 3;

  const navClass = isDarkMode
    ? "border-white/10 bg-[#0b0b0f]"
    : "border-zinc-200 bg-white/95";
  const searchClass = isDarkMode
    ? "border border-white/10 bg-white/5 text-zinc-400"
    : "border border-zinc-200 bg-transparent text-zinc-500";
  const mobilePanelClass = isDarkMode
    ? "border-white/10 bg-[#0b0b0f]"
    : "border-zinc-200 bg-white";
  const searchPlaceholder = useMemo(
    () => `Search ${activePage.toLowerCase()}...`,
    [activePage]
  );

  return (
    <nav className={`sticky top-0 z-50 border-b py-3 backdrop-blur ${navClass}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 md:gap-6 md:px-6">
        <div className="flex items-center gap-2 md:mr-3">
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
            <Zap className="size-4 text-white" />
          </div>
          <span
            className={`text-sm font-semibold md:text-base ${isDarkMode ? "text-white" : "text-zinc-900"}`}
          >
            TechCorp
          </span>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                item === activePage
                  ? isDarkMode
                    ? "text-white"
                    : "text-zinc-900"
                  : isDarkMode
                    ? "text-zinc-400 hover:bg-white/5 hover:text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="ml-auto" />

        <div
          className={`hidden w-44 items-center gap-2 rounded-xl px-3 py-2 text-sm sm:flex lg:w-56 xl:w-72 ${searchClass}`}
        >
          <Search className="size-4 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-inherit"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={onToggleTheme}
            className={`rounded-xl p-2 transition ${isDarkMode ? "text-amber-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <button
            className={`relative rounded-xl p-2 transition ${isDarkMode ? "text-zinc-300 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-rose-500 px-1 text-center text-[10px] font-semibold text-white">
              {notifications}
            </span>
          </button>
          <button
            className={`hidden rounded-xl p-2 transition sm:block ${isDarkMode ? "text-zinc-300 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </button>
          <button
            onClick={() => setIsUserMenuOpen((value) => !value)}
            className={`flex items-center gap-1 rounded-xl py-1 pl-1 pr-2 transition ${isDarkMode ? "hover:bg-white/10" : "hover:bg-zinc-100"}`}
            aria-label="User menu"
          >
            <div
              className={`size-7 rounded-full ${isDarkMode ? "bg-white" : "bg-zinc-300"}`}
            />
            <ChevronDown
              className={`size-4 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
            />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className={`rounded-xl p-2 transition md:hidden ${isDarkMode ? "text-zinc-300 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isUserMenuOpen && (
        <div className="mx-auto mt-2 flex max-w-7xl justify-end px-4 md:px-6">
          <div
            className={`w-44 rounded-xl border p-1 text-sm shadow-lg ${mobilePanelClass}`}
          >
            {["Profile", "Preferences", "Sign out"].map((item) => (
              <button
                key={item}
                className={`w-full rounded-lg px-3 py-2 text-left ${
                  isDarkMode
                    ? "text-zinc-300 hover:bg-white/10"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-7xl px-4 md:hidden">
          <div className={`rounded-xl border p-3 ${mobilePanelClass}`}>
            <div className={`mb-3 flex items-center gap-2 rounded-xl px-3 py-2 ${searchClass}`}>
              <Search className="size-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm outline-none placeholder:text-inherit"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    onPageChange(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`rounded-lg px-3 py-2 text-left text-sm ${
                    item === activePage
                      ? isDarkMode
                        ? "bg-white/10 text-white"
                        : "bg-zinc-100 text-zinc-900"
                      : isDarkMode
                        ? "text-zinc-400 hover:bg-white/10"
                        : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
