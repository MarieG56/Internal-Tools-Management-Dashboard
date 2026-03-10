import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import type { ToolItem } from "../data/dashboardData";
import StatusBadge from "./StatusBadge";

const ITEMS_PER_PAGE = 10;

function toCostNumber(cost: string): number {
  return Number(cost.replace(/[€,\s]/g, ""));
}

interface ToolsTableProps {
  tools: ToolItem[];
  isDarkMode: boolean;
}

type SortBy = "tool" | "users" | "monthlyCost";
type SortDirection = "asc" | "desc";

export default function ToolsTable({ tools, isDarkMode }: ToolsTableProps) {
  const [sortBy, setSortBy] = useState<SortBy>("tool");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [openActionFor, setOpenActionFor] = useState<string | null>(null);

  const wrapperClass = isDarkMode
    ? "border-white/10 border-b-transparent bg-[#0b0b0f]"
    : "border-zinc-200 border-b-transparent bg-white shadow-sm";
  const bodyTextClass = isDarkMode ? "text-zinc-400" : "text-zinc-600";
  const metaTextClass = isDarkMode ? "text-zinc-400" : "text-zinc-500";
  const titleTextClass = isDarkMode ? "text-white" : "text-zinc-900";
  const toolNameTextClass = isDarkMode ? "text-white" : "text-zinc-900";
  const actionsMenuClass = isDarkMode
    ? "border-white/10 bg-[#13131a]"
    : "border-zinc-200 bg-white";
  const actionItemClass = isDarkMode
    ? "text-zinc-300 hover:bg-white/10"
    : "text-zinc-700 hover:bg-zinc-100";

  const sortedTools = useMemo(() => {
    const sorted = [...tools];
    sorted.sort((a, b) => {
      if (sortBy === "tool") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === "users") {
        return sortDirection === "asc" ? a.users - b.users : b.users - a.users;
      }
      const aCost = toCostNumber(a.monthlyCost);
      const bCost = toCostNumber(b.monthlyCost);
      return sortDirection === "asc" ? aCost - bCost : bCost - aCost;
    });
    return sorted;
  }, [tools, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedTools.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedTools = sortedTools.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const applySort = (column: SortBy) => {
    setPage(1);
    if (sortBy === column) {
      setSortDirection((value) => (value === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(column);
    setSortDirection("asc");
  };

  return (
    <section className={`rounded-2xl border ${wrapperClass}`}>
      <header className="flex items-center justify-between px-5 pb-4 pt-6 sm:px-6 sm:pt-7">
        <h2 className={`text-base font-semibold ${titleTextClass}`}>Recent Tools</h2>
        <div className={`inline-flex items-center gap-2 text-xs font-medium ${metaTextClass}`}>
          <Calendar className="size-4" />
          Last 30 days
        </div>
      </header>

      <div className="pb-3 md:hidden">
        <div className="px-5 sm:px-6">
          {paginatedTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <article
                key={tool.name}
                className={`relative py-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[0.5px] after:content-[''] ${
                  isDarkMode ? "after:bg-white/10" : "after:bg-zinc-100"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`size-5 ${tool.iconColorClass}`} />
                    <span className={`text-sm font-medium ${toolNameTextClass}`}>{tool.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge status={tool.status} />
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenActionFor((value) => (value === tool.name ? null : tool.name))
                        }
                        className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
                        aria-label="Open actions"
                      >
                        <EllipsisVertical className="size-4" />
                      </button>
                      {openActionFor === tool.name && (
                        <div
                          className={`absolute right-0 top-9 z-20 w-28 rounded-lg border p-1 shadow-lg ${actionsMenuClass}`}
                        >
                          {["View", "Edit", "Delete"].map((action) => (
                            <button
                              key={action}
                              onClick={() => setOpenActionFor(null)}
                              className={`w-full rounded-md px-2 py-1.5 text-left text-xs ${actionItemClass}`}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p className={bodyTextClass}>Department</p>
                  <p className={`${bodyTextClass} text-right`}>{tool.department}</p>
                  <p className={bodyTextClass}>Users</p>
                  <p className={`${bodyTextClass} text-right`}>{tool.users}</p>
                  <p className={bodyTextClass}>Monthly Cost</p>
                  <p className={`${bodyTextClass} text-right`}>{tool.monthlyCost}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="hidden overflow-x-auto pb-3 md:block">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr
              className={`relative text-left text-xs tracking-normal after:absolute after:bottom-0 after:left-5 after:right-5 after:h-[0.5px] after:content-[''] sm:after:left-6 sm:after:right-6 ${
                isDarkMode
                  ? "text-zinc-400 after:bg-white/10"
                  : "text-zinc-500 after:bg-zinc-100"
              }`}
            >
              <th className="py-3 pl-8 pr-5 font-normal sm:pl-9 sm:pr-6">
                <button onClick={() => applySort("tool")} className="inline-flex items-center gap-1">
                  Tool {sortBy === "tool" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </button>
              </th>
              <th className="px-5 py-3 font-normal sm:px-6">Department</th>
              <th className="px-5 py-3 font-normal sm:px-6">
                <button onClick={() => applySort("users")} className="inline-flex items-center gap-1">
                  Users {sortBy === "users" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </button>
              </th>
              <th className="px-5 py-3 font-normal sm:px-6">
                <button
                  onClick={() => applySort("monthlyCost")}
                  className="inline-flex items-center gap-1"
                >
                  Monthly Cost{" "}
                  {sortBy === "monthlyCost" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                </button>
              </th>
              <th className="px-5 py-3 font-normal sm:px-6">Status</th>
              <th className="px-5 py-3 font-normal sm:px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <tr
                  key={tool.name}
                  className={`relative transition after:absolute after:bottom-0 after:left-5 after:right-5 after:h-[0.5px] after:content-[''] sm:after:left-6 sm:after:right-6 ${
                    isDarkMode
                      ? "hover:bg-white/5 after:bg-white/10"
                      : "hover:bg-zinc-50 after:bg-zinc-100"
                  }`}
                >
                  <td className="py-4 pl-8 pr-5 sm:pl-9 sm:pr-6">
                    <div className="flex items-center gap-3">
                      <Icon className={`size-5 ${tool.iconColorClass}`} />
                      <span className={`text-sm font-medium ${toolNameTextClass}`}>{tool.name}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-sm sm:px-6 ${bodyTextClass}`}>{tool.department}</td>
                  <td className={`px-5 py-4 text-sm sm:px-6 ${bodyTextClass}`}>{tool.users}</td>
                  <td className={`px-5 py-4 text-sm sm:px-6 ${bodyTextClass}`}>
                    {tool.monthlyCost}
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <StatusBadge status={tool.status} />
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenActionFor((value) => (value === tool.name ? null : tool.name))
                        }
                        className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
                        aria-label="Open actions"
                      >
                        <EllipsisVertical className="size-4" />
                      </button>
                      {openActionFor === tool.name && (
                        <div
                          className={`absolute right-0 top-9 z-20 w-28 rounded-lg border p-1 shadow-lg ${actionsMenuClass}`}
                        >
                          {["View", "Edit", "Delete"].map((action) => (
                            <button
                              key={action}
                              onClick={() => setOpenActionFor(null)}
                              className={`w-full rounded-md px-2 py-1.5 text-left text-xs ${actionItemClass}`}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 pb-4 pt-2 text-xs sm:px-6">
        <span className={bodyTextClass}>
          Showing {paginatedTools.length === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, sortedTools.length)} of {sortedTools.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={safePage <= 1}
            className={`rounded-lg border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50 ${
              isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"
            }`}
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className={bodyTextClass}>
            Page {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={safePage >= totalPages}
            className={`rounded-lg border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50 ${
              isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"
            }`}
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
