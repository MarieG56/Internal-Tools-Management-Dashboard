import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import {
  Archive,
  CheckSquare,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Square,
  ToggleLeft,
} from "lucide-react";
import AppNavbar from "../components/AppNavbar";
import StatusBadge from "../components/StatusBadge";
import { useToolsData } from "../hooks/useToolsData";
import { createTool, updateTool } from "../utils/api";
import {
  navLinks,
  navPathMap,
  type ToolApiStatus,
  type ToolStatus,
} from "../utils/dashboardData";
import type { ApiTool, CreateToolPayload } from "../utils/apiTypes";

function toDisplayStatus(status: ToolApiStatus): ToolStatus {
  if (status === "active") return "Active";
  if (status === "expiring") return "Expiring";
  return "Unused";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR");
}

const INITIAL_FORM: CreateToolPayload = {
  name: "",
  description: "",
  vendor: "",
  category: "",
  monthly_cost: 0,
  previous_month_cost: 0,
  owner_department: "",
  status: "active",
  website_url: "",
  active_users_count: 0,
  icon_url: "",
};

interface FeedbackState {
  type: "success" | "error";
  message: string;
}

interface ConfirmState {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
}

interface PageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function ToolsPage({ isDarkMode, toggleTheme }: PageProps) {
  const router = useRouter();
  const { tools, setTools, departments, isLoading, error, refresh } = useToolsData();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ToolApiStatus>("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minCost, setMinCost] = useState<number | "">("");
  const [maxCost, setMaxCost] = useState<number | "">("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [detailsTool, setDetailsTool] = useState<ApiTool | null>(null);
  const [editTool, setEditTool] = useState<ApiTool | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<CreateToolPayload>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const id = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(id);
  }, [feedback]);

  const categories = useMemo(() => {
    return Array.from(new Set(tools.map((tool) => tool.category))).sort();
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools
      .filter((tool) => {
        if (searchQuery.trim()) {
          const v = searchQuery.toLowerCase();
          const matchesSearch =
            tool.name.toLowerCase().includes(v) ||
            tool.description.toLowerCase().includes(v) ||
            tool.vendor.toLowerCase().includes(v);
          if (!matchesSearch) return false;
        }
        if (statusFilter !== "all" && tool.status !== statusFilter) return false;
        if (departmentFilter !== "all" && tool.owner_department !== departmentFilter) return false;
        if (categoryFilter !== "all" && tool.category !== categoryFilter) return false;
        if (minCost !== "" && tool.monthly_cost < minCost) return false;
        if (maxCost !== "" && tool.monthly_cost > maxCost) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tools, searchQuery, statusFilter, departmentFilter, categoryFilter, minCost, maxCost]);

  const allFilteredSelected =
    filteredTools.length > 0 && filteredTools.every((tool) => selectedIds.includes(tool.id));

  const toggleSelected = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleSelectAllFiltered = () => {
    setSelectedIds((current) => {
      if (allFilteredSelected) {
        return current.filter((id) => !filteredTools.some((tool) => tool.id === id));
      }
      const merged = new Set([...current, ...filteredTools.map((tool) => tool.id)]);
      return Array.from(merged);
    });
  };

  const runConfirmAction = async () => {
    if (!confirmState) return;
    setIsSubmitting(true);
    try {
      await confirmState.onConfirm();
      setConfirmState(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setFeedback({ type: "error", message: `Action failed: ${message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyBulkStatus = (status: ToolApiStatus, label: string) => {
    const targetIds = [...selectedIds];
    if (targetIds.length === 0) return;
    setConfirmState({
      title: `${label} selected tools`,
      description: `This will update ${targetIds.length} selected tool(s).`,
      confirmLabel: label,
      onConfirm: async () => {
        await Promise.all(targetIds.map((id) => updateTool(id, { status })));
        await refresh();
        setSelectedIds([]);
        setFeedback({ type: "success", message: `${targetIds.length} tool(s) updated.` });
      },
    });
  };

  const handleCreate = () => {
    if (!form.name || !form.description || !form.vendor || !form.category || !form.owner_department) {
      setFeedback({ type: "error", message: "Please complete required fields before saving." });
      return;
    }
    setConfirmState({
      title: "Create new tool",
      description: "Do you want to create this tool in the catalog?",
      confirmLabel: "Create",
      onConfirm: async () => {
        await createTool(form);
        setForm(INITIAL_FORM);
        setIsAddOpen(false);
        await refresh();
        setFeedback({ type: "success", message: "Tool created successfully." });
      },
    });
  };

  const handleUpdate = () => {
    if (!editTool) return;
    setConfirmState({
      title: "Save tool changes",
      description: `Apply updates to ${editTool.name}?`,
      confirmLabel: "Save changes",
      onConfirm: async () => {
        await updateTool(editTool.id, {
          name: editTool.name,
          description: editTool.description,
          vendor: editTool.vendor,
          category: editTool.category,
          owner_department: editTool.owner_department,
          status: editTool.status,
          monthly_cost: editTool.monthly_cost,
          previous_month_cost: editTool.previous_month_cost,
          active_users_count: editTool.active_users_count,
          website_url: editTool.website_url,
        });
        setEditTool(null);
        await refresh();
        setFeedback({ type: "success", message: "Tool updated successfully." });
      },
    });
  };

  const toggleToolStatus = (tool: ApiTool) => {
    const nextStatus: ToolApiStatus = tool.status === "active" ? "unused" : "active";
    const label = nextStatus === "active" ? "Enable tool" : "Disable tool";
    setConfirmState({
      title: label,
      description: `${label} "${tool.name}"?`,
      confirmLabel: label,
      onConfirm: async () => {
        await updateTool(tool.id, { status: nextStatus });
        setTools((current) =>
          current.map((item) => (item.id === tool.id ? { ...item, status: nextStatus } : item))
        );
        setFeedback({ type: "success", message: `${tool.name} updated.` });
      },
    });
  };

  const archiveTool = (tool: ApiTool) => {
    setConfirmState({
      title: "Archive tool",
      description: `Archive "${tool.name}"? This sets status to unused.`,
      confirmLabel: "Archive",
      onConfirm: async () => {
        await updateTool(tool.id, { status: "unused" });
        setTools((current) =>
          current.map((item) => (item.id === tool.id ? { ...item, status: "unused" } : item))
        );
        setFeedback({ type: "success", message: `${tool.name} archived.` });
      },
    });
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
        activePage="Tools"
        onPageChange={(page) => void router.push(navPathMap[page])}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search in tools catalog..."
      />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {feedback && (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/30 bg-rose-500/10 text-rose-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
              Tools Catalog
            </h1>
            <p className={`mt-1 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
              Manage your full SaaS catalog with filters and quick operations
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void refresh()}
              className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm ${
                isDarkMode ? "border-white/10 text-zinc-300 hover:bg-white/10" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <RefreshCw className="size-4" /> Refresh
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-3 py-2 text-sm text-white"
            >
              <Plus className="size-4" /> Add New Tool
            </button>
          </div>
        </div>

        <section
          className={`mb-4 rounded-2xl border p-4 ${isDarkMode ? "border-white/10 bg-[#0b0b0f]" : "border-zinc-200 bg-white"}`}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`}
            >
              <option value="all" className={`font-bold ${isDarkMode ? "bg-[#0b0b0f] text-white" : ""}`}>All Departments</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.name} className={`font-normal ${isDarkMode ? "bg-[#0b0b0f] text-zinc-300" : ""}`}>
                  {dep.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "all" | ToolApiStatus)}
              className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`}
            >
              <option value="all" className={`font-bold ${isDarkMode ? "bg-[#0b0b0f] text-white" : ""}`}>All Status</option>
              <option value="active" className={`font-normal ${isDarkMode ? "bg-[#0b0b0f] text-zinc-300" : ""}`}>Active</option>
              <option value="expiring" className={`font-normal ${isDarkMode ? "bg-[#0b0b0f] text-zinc-300" : ""}`}>Expiring</option>
              <option value="unused" className={`font-normal ${isDarkMode ? "bg-[#0b0b0f] text-zinc-300" : ""}`}>Unused</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`}
            >
              <option value="all" className={`font-bold ${isDarkMode ? "bg-[#0b0b0f] text-white" : ""}`}>All categories</option>
              {categories.map((category) => (
                <option key={category} value={category} className={`font-normal ${isDarkMode ? "bg-[#0b0b0f] text-zinc-300" : ""}`}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min cost"
              value={minCost}
              onChange={(event) => setMinCost(event.target.value === "" ? "" : Number(event.target.value))}
              className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300 placeholder:text-zinc-500" : "border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400"}`}
            />
            <input
              type="number"
              placeholder="Max cost"
              value={maxCost}
              onChange={(event) => setMaxCost(event.target.value === "" ? "" : Number(event.target.value))}
              className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300 placeholder:text-zinc-500" : "border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400"}`}
            />
            <button
              onClick={() => {
                setStatusFilter("all");
                setDepartmentFilter("all");
                setCategoryFilter("all");
                setMinCost("");
                setMaxCost("");
              }}
              className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 text-zinc-300 hover:bg-white/10" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
            >
              Reset filters
            </button>
          </div>
        </section>

        <section
          className={`rounded-2xl border ${isDarkMode ? "border-white/10 bg-[#0b0b0f]" : "border-zinc-200 bg-white shadow-sm"}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-3 pt-5 sm:px-6">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAllFiltered}
                className={`rounded-lg p-1 ${isDarkMode ? "hover:bg-white/10" : "hover:bg-zinc-100"}`}
                aria-label="Select all filtered tools"
              >
                {allFilteredSelected ? (
                  <CheckSquare className="size-4 text-violet-500" />
                ) : (
                  <Square className={`size-4 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`} />
                )}
              </button>
              <span className={`text-sm ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                {filteredTools.length} tools
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyBulkStatus("active", "Enable")}
                disabled={selectedIds.length === 0 || isSubmitting}
                className={`rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50 ${isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}
              >
                Enable selected
              </button>
              <button
                onClick={() => applyBulkStatus("unused", "Disable")}
                disabled={selectedIds.length === 0 || isSubmitting}
                className={`rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50 ${isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}
              >
                Disable selected
              </button>
              <button
                onClick={() => applyBulkStatus("expiring", "Mark expiring")}
                disabled={selectedIds.length === 0 || isSubmitting}
                className={`rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50 ${isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}
              >
                Mark Expiring
              </button>
              <button
                onClick={() => applyBulkStatus("unused", "Archive")}
                disabled={selectedIds.length === 0 || isSubmitting}
                className={`rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50 ${isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}
              >
                Archive selected
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="px-6 pb-6">
              <div className={`animate-pulse rounded-xl border p-6 ${isDarkMode ? "border-white/10" : "border-zinc-100"}`}>
                <div className={`mb-3 h-4 w-40 rounded ${isDarkMode ? "bg-zinc-700" : "bg-zinc-200"}`} />
                <div className={`h-3 w-full rounded ${isDarkMode ? "bg-zinc-800" : "bg-zinc-100"}`} />
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="px-6 pb-6">
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
                Failed to load tools: {error}
              </div>
            </div>
          )}

          {!isLoading && !error && filteredTools.length === 0 && (
            <div className="px-6 pb-6">
              <div className={`rounded-xl border p-8 text-center text-sm ${isDarkMode ? "border-white/10 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>
                No tools found for current filters.
              </div>
            </div>
          )}

          {!isLoading && !error && filteredTools.length > 0 && (
            <>
              <div className="grid gap-4 p-4 md:hidden">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className={`rounded-xl border p-4 ${isDarkMode ? "border-white/10 bg-[#13131a]" : "border-zinc-200 bg-zinc-50"}`}>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleSelected(tool.id)} className="mt-0.5 rounded">
                          {selectedIds.includes(tool.id) ? (
                            <CheckSquare className="size-4 text-violet-500" />
                          ) : (
                            <Square className={`size-4 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`} />
                          )}
                        </button>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{tool.name}</p>
                          <p className="mt-0.5 text-xs text-zinc-500">{tool.category}</p>
                        </div>
                      </div>
                      <StatusBadge status={toDisplayStatus(tool.status)} />
                    </div>
                    
                    <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
                      <p className={isDarkMode ? "text-zinc-400" : "text-zinc-500"}>Department</p>
                      <p className={`text-right ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>{tool.owner_department}</p>
                      <p className={isDarkMode ? "text-zinc-400" : "text-zinc-500"}>Users</p>
                      <p className={`text-right ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>{tool.active_users_count}</p>
                      <p className={isDarkMode ? "text-zinc-400" : "text-zinc-500"}>Monthly Cost</p>
                      <p className={`text-right ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>{formatCurrency(tool.monthly_cost)}</p>
                    </div>

                    <div className={`flex items-center justify-end gap-1 border-t pt-3 ${isDarkMode ? "border-white/10" : "border-zinc-200"}`}>
                      <button onClick={() => setDetailsTool(tool)} className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-200"}`} title="View details"><Eye className="size-4" /></button>
                      <button onClick={() => setEditTool(tool)} className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-200"}`} title="Edit tool"><Pencil className="size-4" /></button>
                      <button onClick={() => void toggleToolStatus(tool)} className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-200"}`} title={tool.status === "active" ? "Disable tool" : "Enable tool"}><ToggleLeft className="size-4" /></button>
                      <button onClick={() => archiveTool(tool)} className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-200"}`} title="Archive tool"><Archive className="size-4" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto pb-3 md:block">
                <table className="w-full min-w-[980px]">
                <thead>
                  <tr className={`text-left text-xs ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                    <th className="px-6 py-3 font-normal">Select</th>
                    <th className="px-6 py-3 font-normal">Tool</th>
                    <th className="px-6 py-3 font-normal">Category</th>
                    <th className="px-6 py-3 font-normal">Department</th>
                    <th className="px-6 py-3 font-normal">Users</th>
                    <th className="px-6 py-3 font-normal">Monthly Cost</th>
                    <th className="px-6 py-3 font-normal">Last update</th>
                    <th className="px-6 py-3 font-normal">Status</th>
                    <th className="px-6 py-3 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map((tool) => (
                    <tr
                      key={tool.id}
                      className={`border-t ${isDarkMode ? "border-white/10 hover:bg-white/5" : "border-zinc-100 hover:bg-zinc-50"}`}
                    >
                      <td className="px-6 py-4">
                        <button onClick={() => toggleSelected(tool.id)} className="rounded">
                          {selectedIds.includes(tool.id) ? (
                            <CheckSquare className="size-4 text-violet-500" />
                          ) : (
                            <Square className={`size-4 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`} />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{tool.name}</p>
                          <p className="mt-0.5 text-xs text-zinc-500">{tool.description}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>{tool.category}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>{tool.owner_department}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>{tool.active_users_count}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>{formatCurrency(tool.monthly_cost)}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>{formatDate(tool.updated_at)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={toDisplayStatus(tool.status)} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setDetailsTool(tool)}
                            className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
                            title="View details"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            onClick={() => setEditTool(tool)}
                            className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
                            title="Edit tool"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => void toggleToolStatus(tool)}
                            className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
                            title={tool.status === "active" ? "Disable tool" : "Enable tool"}
                          >
                            <ToggleLeft className="size-4" />
                          </button>
                          <button
                            onClick={() => archiveTool(tool)}
                            className={`rounded-lg p-1.5 ${isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"}`}
                            title="Archive tool"
                          >
                            <Archive className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </section>
      </main>

      {(isAddOpen || detailsTool || editTool) && (
        <div className="fixed inset-0 z-[70] bg-black/50 p-4 md:p-8">
          <div className={`mx-auto max-w-2xl rounded-2xl border p-5 ${isDarkMode ? "border-white/10 bg-[#0b0b0f]" : "border-zinc-200 bg-white"}`}>
            {isAddOpen && (
              <>
                <h3 className={`mb-4 text-lg font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Add New Tool</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { key: "name", label: "Name" },
                    { key: "vendor", label: "Vendor" },
                    { key: "category", label: "Category" },
                    { key: "owner_department", label: "Department" },
                    { key: "website_url", label: "Website URL" },
                  ].map((field) => (
                    <input
                      key={field.key}
                      placeholder={field.label}
                      value={String(form[field.key as keyof CreateToolPayload] ?? "")}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300 placeholder:text-zinc-500" : "border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400"}`}
                    />
                  ))}
                  <input
                    placeholder="Active users"
                    type="number"
                    value={form.active_users_count}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, active_users_count: Number(event.target.value) }))
                    }
                    className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300 placeholder:text-zinc-500" : "border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400"}`}
                  />
                  <input
                    placeholder="Monthly cost"
                    type="number"
                    value={form.monthly_cost}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, monthly_cost: Number(event.target.value) }))
                    }
                    className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300 placeholder:text-zinc-500" : "border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400"}`}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className={`mt-3 min-h-24 w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300 placeholder:text-zinc-500" : "border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400"}`}
                />
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setIsAddOpen(false)} className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}>Cancel</button>
                  <button disabled={isSubmitting} onClick={() => void handleCreate()} className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-3 py-2 text-sm text-white"><Save className="size-4" /> Save tool</button>
                </div>
              </>
            )}

            {detailsTool && (
              <>
                <h3 className={`mb-4 text-lg font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Tool Details</h3>
                <div className={`grid gap-2 text-sm ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                  <p><span className="font-medium">Name:</span> {detailsTool.name}</p>
                  <p><span className="font-medium">Vendor:</span> {detailsTool.vendor}</p>
                  <p><span className="font-medium">Category:</span> {detailsTool.category}</p>
                  <p><span className="font-medium">Department:</span> {detailsTool.owner_department}</p>
                  <p><span className="font-medium">Description:</span> {detailsTool.description}</p>
                  <p><span className="font-medium">Website:</span> {detailsTool.website_url}</p>
                  <p><span className="font-medium">Cost:</span> {formatCurrency(detailsTool.monthly_cost)}</p>
                  <p><span className="font-medium">Users:</span> {detailsTool.active_users_count}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setDetailsTool(null)} className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}>Close</button>
                </div>
              </>
            )}

            {editTool && (
              <>
                <h3 className={`mb-4 text-lg font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Edit Tool</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={editTool.name} onChange={(event) => setEditTool((current) => current ? { ...current, name: event.target.value } : current)} className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`} />
                  <input value={editTool.vendor} onChange={(event) => setEditTool((current) => current ? { ...current, vendor: event.target.value } : current)} className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`} />
                  <input value={editTool.category} onChange={(event) => setEditTool((current) => current ? { ...current, category: event.target.value } : current)} className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`} />
                  <input value={editTool.owner_department} onChange={(event) => setEditTool((current) => current ? { ...current, owner_department: event.target.value } : current)} className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`} />
                  <input type="number" value={editTool.monthly_cost} onChange={(event) => setEditTool((current) => current ? { ...current, monthly_cost: Number(event.target.value) } : current)} className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`} />
                  <select value={editTool.status} onChange={(event) => setEditTool((current) => current ? { ...current, status: event.target.value as ToolApiStatus } : current)} className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`}>
                    <option value="active" className={isDarkMode ? "bg-[#0b0b0f] text-zinc-300" : ""}>active</option>
                    <option value="expiring" className={isDarkMode ? "bg-[#0b0b0f] text-zinc-300" : ""}>expiring</option>
                    <option value="unused" className={isDarkMode ? "bg-[#0b0b0f] text-zinc-300" : ""}>unused</option>
                  </select>
                </div>
                <textarea value={editTool.description} onChange={(event) => setEditTool((current) => current ? { ...current, description: event.target.value } : current)} className={`mt-3 min-h-24 w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 bg-transparent text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`} />
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setEditTool(null)} className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}>Cancel</button>
                  <button disabled={isSubmitting} onClick={() => void handleUpdate()} className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-3 py-2 text-sm text-white"><Save className="size-4" /> Save changes</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {confirmState && (
        <div className="fixed inset-0 z-[90] bg-black/60 p-4 md:p-8">
          <div className={`mx-auto max-w-md rounded-2xl border p-5 ${isDarkMode ? "border-white/10 bg-[#0b0b0f]" : "border-zinc-200 bg-white"}`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
              {confirmState.title}
            </h3>
            <p className={`mt-2 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              {confirmState.description}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmState(null)}
                disabled={isSubmitting}
                className={`rounded-xl border px-3 py-2 text-sm ${isDarkMode ? "border-white/10 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}
              >
                Cancel
              </button>
              <button
                onClick={() => void runConfirmAction()}
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
