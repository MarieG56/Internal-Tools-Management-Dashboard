import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, AlertTriangle, TrendingUp, Users, DollarSign, ExternalLink, Download } from "lucide-react";
import AppNavbar from "../components/AppNavbar";
import { navLinks, navPathMap } from "../utils/dashboardData";
import { useToolsData } from "../hooks/useToolsData";

interface PageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const COLORS = ["#8b5cf6", "#ec4899", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6", "#6366f1"];

export default function AnalyticsPage({ isDarkMode, toggleTheme }: PageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("6m");
  const [selectedDep, setSelectedDep] = useState<string | null>(null);
  const { tools, isLoading } = useToolsData(10000); // Live refresh every 10s

  // Derived Data
  const totalMonthlyCost = useMemo(() => {
    const multiplier = timeRange === "30d" ? 1 : timeRange === "90d" ? 3 : timeRange === "1y" ? 12 : 6;
    return tools.reduce((sum, tool) => sum + (Number(tool.monthly_cost) || 0), 0) * multiplier;
  }, [tools, timeRange]);

  const potentialSavings = useMemo(() => {
    const multiplier = timeRange === "30d" ? 1 : timeRange === "90d" ? 3 : timeRange === "1y" ? 12 : 6;
    return tools
      .filter((t) => t.status === "unused" || (Number(t.active_users_count) || 0) === 0)
      .reduce((sum, tool) => sum + (Number(tool.monthly_cost) || 0), 0) * multiplier;
  }, [tools, timeRange]);

  const departmentCosts = useMemo(() => {
    const costs: Record<string, number> = {};
    
    // Simulate slight variations based on timeRange
    const multiplier = timeRange === "30d" ? 1 : timeRange === "90d" ? 3 : timeRange === "1y" ? 12 : 6;

    tools.forEach((tool) => {
      // Normalize department names (e.g. "engineering" -> "Engineering")
      // and handle missing/undefined departments
      let depName = tool.owner_department;
      if (!depName || depName === "undefined") {
        depName = "Other";
      } else {
        depName = depName.charAt(0).toUpperCase() + depName.slice(1).toLowerCase();
      }

      costs[depName] = (costs[depName] || 0) + ((Number(tool.monthly_cost) || 0) * multiplier);
    });
    
    return Object.entries(costs)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [tools, timeRange]);

  const topExpensiveTools = useMemo(() => {
    const multiplier = timeRange === "30d" ? 1 : timeRange === "90d" ? 3 : timeRange === "1y" ? 12 : 6;

    return tools
      .filter((t) => {
        if (!selectedDep) return true;
        let depName = t.owner_department;
        if (!depName || depName === "undefined") depName = "Other";
        else depName = depName.charAt(0).toUpperCase() + depName.slice(1).toLowerCase();
        return depName === selectedDep;
      })
      .sort((a, b) => (Number(b.monthly_cost) || 0) - (Number(a.monthly_cost) || 0))
      .slice(0, 5)
      .map((t) => ({ name: t.name, cost: (Number(t.monthly_cost) || 0) * multiplier }));
  }, [tools, selectedDep, timeRange]);

  const unusedTools = useMemo(() => {
    return tools.filter((t) => t.status === "unused" || (Number(t.active_users_count) || 0) === 0);
  }, [tools]);

  const topUsedTools = useMemo(() => {
    return tools
      .filter((t) => {
        if (!selectedDep) return true;
        let depName = t.owner_department;
        if (!depName || depName === "undefined") depName = "Other";
        else depName = depName.charAt(0).toUpperCase() + depName.slice(1).toLowerCase();
        return depName === selectedDep;
      })
      .sort((a, b) => (Number(b.active_users_count) || 0) - (Number(a.active_users_count) || 0))
      .slice(0, 5)
      .map((t) => ({ name: t.name, users: Number(t.active_users_count) || 0 }));
  }, [tools, selectedDep]);

  // Mock historical data based on current total and time range
  const historicalSpend = useMemo(() => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    
    // Adjust data points based on selected time range
    if (timeRange === "30d") {
      months = ["Week 1", "Week 2", "Week 3", "Week 4", "Next W1", "Next W2"];
    } else if (timeRange === "90d") {
      months = ["Month -2", "Month -1", "Current", "Next M1", "Next M2"];
    } else if (timeRange === "1y") {
      months = ["Q1", "Q2", "Q3", "Q4", "Next Q1", "Next Q2"];
    }

    const currentIdx = Math.floor(months.length * 0.6); // 60% actual, 40% projected
    let current = totalMonthlyCost * 0.8; 
    
    return months.map((month, i) => {
      if (i === currentIdx) return { month, actualSpend: totalMonthlyCost, projectedSpend: totalMonthlyCost };
      if (i > currentIdx) {
        // Projected future months
        const variation = current * (0.01 + Math.random() * 0.03);
        current += variation;
        return { month, projectedSpend: Math.round(current) };
      }
      // Past months
      const variation = current * (0.02 + Math.random() * 0.05);
      current += variation;
      return { month, actualSpend: Math.round(current) };
    });
  }, [totalMonthlyCost, timeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isCurrency = payload[0].dataKey === "actualSpend" || payload[0].dataKey === "projectedSpend" || payload[0].dataKey === "cost" || payload[0].dataKey === "value";
      return (
        <div className={`rounded-lg border p-3 shadow-lg ${isDarkMode ? "border-white/10 bg-[#13131a]" : "border-zinc-200 bg-white"}`}>
          <p className={`mb-1 text-sm font-medium ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color || "#8b5cf6" }}>
              {entry.name === "projectedSpend" ? "Projected: " : ""}
              {isCurrency ? formatCurrency(entry.value) : `${entry.value} users`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleExportCSV = () => {
    const headers = ["Name,Vendor,Category,Department,Monthly Cost,Users,Status"];
    const rows = tools.map(t => `${t.name},${t.vendor},${t.category},${t.owner_department},${Number(t.monthly_cost) || 0},${Number(t.active_users_count) || 0},${t.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tools_analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cardClass = isDarkMode ? "border-white/10 bg-[#0b0b0f]" : "border-zinc-200 bg-white shadow-sm";
  const textTitleClass = isDarkMode ? "text-white" : "text-zinc-900";
  const textMutedClass = isDarkMode ? "text-zinc-400" : "text-zinc-500";

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
        activePage="Analytics"
        onPageChange={(page) => void router.push(navPathMap[page])}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Search in tools catalog..."
      />
      
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className={`text-3xl font-bold tracking-tight ${textTitleClass}`}>
                Analytics & Insights
              </h1>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                </span>
                Live
              </div>
            </div>
            <p className={`mt-1 text-sm ${textMutedClass}`}>
              Monitor costs, usage trends, and optimization opportunities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                isDarkMode ? "border-white/10 text-zinc-300 hover:bg-white/10" : "border-zinc-200 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <Download className="size-4" />
              Export Report
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`rounded-xl border pl-3 pr-8 py-2 text-sm appearance-none bg-no-repeat ${
                isDarkMode ? "border-white/10 bg-[#0b0b0f] text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='${isDarkMode ? '%23a1a1aa' : '%2371717a'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1rem 1rem'
              }}
            >
              <option value="30d" className={isDarkMode ? "bg-[#0b0b0f]" : ""}>Last 30 Days</option>
              <option value="90d" className={isDarkMode ? "bg-[#0b0b0f]" : ""}>Last 90 Days</option>
              <option value="6m" className={isDarkMode ? "bg-[#0b0b0f]" : ""}>Last 6 Months</option>
              <option value="1y" className={isDarkMode ? "bg-[#0b0b0f]" : ""}>Last Year</option>
            </select>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`rounded-2xl border p-5 ${cardClass}`}>
            <div className="mb-4 flex items-center justify-between">
              <p className={`text-sm font-medium ${textMutedClass}`}>Total Spend</p>
              <span className="flex size-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                <DollarSign className="size-4" />
              </span>
            </div>
            <p className={`text-2xl font-bold ${textTitleClass}`}>{formatCurrency(totalMonthlyCost)}</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <TrendingUp className="size-3.5" />
              <span>+2.4% vs previous period</span>
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${cardClass}`}>
            <div className="mb-4 flex items-center justify-between">
              <p className={`text-sm font-medium ${textMutedClass}`}>Potential Savings</p>
              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <ArrowDownRight className="size-4" />
              </span>
            </div>
            <p className={`text-2xl font-bold ${textTitleClass}`}>{formatCurrency(potentialSavings)}</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <span>From {unusedTools.length} unused tools</span>
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${cardClass}`}>
            <div className="mb-4 flex items-center justify-between">
              <p className={`text-sm font-medium ${textMutedClass}`}>Active Users</p>
              <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Users className="size-4" />
              </span>
            </div>
            <p className={`text-2xl font-bold ${textTitleClass}`}>
              {tools.reduce((sum, t) => sum + (Number(t.active_users_count) || 0), 0)}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <TrendingUp className="size-3.5" />
              <span>+12% adoption</span>
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${cardClass}`}>
            <div className="mb-4 flex items-center justify-between">
              <p className={`text-sm font-medium ${textMutedClass}`}>Optimization Alerts</p>
              <span className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                <AlertTriangle className="size-4" />
              </span>
            </div>
            <p className={`text-2xl font-bold ${textTitleClass}`}>{unusedTools.length}</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-500">
              <span>Requires attention</span>
            </div>
          </div>
        </div>

        {/* Main Charts */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Spend Evolution */}
          <div className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`mb-6 text-base font-semibold ${textTitleClass}`}>Spend Evolution</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalSpend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#ffffff10" : "#e4e4e7"} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke={isDarkMode ? "#a1a1aa" : "#71717a"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke={isDarkMode ? "#a1a1aa" : "#71717a"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `€${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="actualSpend" 
                    name="Actual Spend"
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projectedSpend" 
                    name="Projected Spend"
                    stroke="#a78bfa" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: "#a78bfa", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className={`text-base font-semibold ${textTitleClass}`}>Department Cost Breakdown</h2>
              {selectedDep && (
                <button 
                  onClick={() => setSelectedDep(null)}
                  className="text-xs text-violet-500 hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex h-[300px] flex-col items-center justify-center sm:flex-row">
              <div className="h-[200px] w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentCosts}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      onClick={(data) => setSelectedDep(data.name === selectedDep ? null : data.name)}
                      className="cursor-pointer"
                    >
                      {departmentCosts.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          opacity={selectedDep && selectedDep !== entry.name ? 0.3 : 1}
                          className="transition-opacity duration-200 hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 w-full sm:mt-0 sm:w-1/2 sm:pl-6">
                <div className="space-y-3">
                  {departmentCosts.map((dep, index) => (
                    <div 
                      key={dep.name} 
                      onClick={() => setSelectedDep(dep.name === selectedDep ? null : dep.name)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg p-1.5 text-sm transition-colors ${
                        selectedDep === dep.name ? (isDarkMode ? "bg-white/10" : "bg-zinc-100") : "hover:bg-transparent"
                      } ${selectedDep && selectedDep !== dep.name ? "opacity-40" : "opacity-100"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className={textMutedClass}>{dep.name}</span>
                      </div>
                      <span className={`font-medium ${textTitleClass}`}>{formatCurrency(dep.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* Top Expensive Tools */}
          <div className={`rounded-2xl border p-5 sm:p-6 lg:col-span-2 ${cardClass}`}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className={`text-base font-semibold ${textTitleClass}`}>
                Top Expensive Tools {selectedDep && <span className="text-violet-500">({selectedDep})</span>}
              </h2>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topExpensiveTools} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#ffffff10" : "#e4e4e7"} horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={100}
                    stroke={isDarkMode ? "#a1a1aa" : "#71717a"}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#ffffff05' : '#f4f4f5' }} />
                  <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={24}>
                    {topExpensiveTools.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actionable Insights */}
          <div className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`mb-6 text-base font-semibold ${textTitleClass}`}>Optimization Alerts</h2>
            <div className="space-y-4">
              {unusedTools.length === 0 ? (
                <div className={`rounded-xl border p-4 text-center text-sm ${isDarkMode ? "border-white/10 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>
                  No optimization alerts at the moment. Great job!
                </div>
              ) : (
                unusedTools.slice(0, 4).map((tool) => (
                  <div key={tool.id} className={`flex items-start justify-between rounded-xl border p-3 ${isDarkMode ? "border-rose-500/20 bg-rose-500/5" : "border-rose-200 bg-rose-50"}`}>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? "text-rose-400" : "text-rose-700"}`}>{tool.name}</p>
                      <p className={`mt-0.5 text-xs ${isDarkMode ? "text-rose-400/70" : "text-rose-600/70"}`}>
                        {tool.status === "unused" ? "Marked as unused" : "Zero active users"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isDarkMode ? "text-rose-400" : "text-rose-700"}`}>{formatCurrency(tool.monthly_cost)}</p>
                      <button 
                        onClick={() => router.push('/tools')}
                        className={`mt-1 inline-flex items-center gap-1 text-xs hover:underline ${isDarkMode ? "text-rose-400/80" : "text-rose-600/80"}`}
                      >
                        Review <ExternalLink className="size-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Adoption */}
          <div className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className={`text-base font-semibold ${textTitleClass}`}>
                Top Used Tools (Adoption) {selectedDep && <span className="text-violet-500">({selectedDep})</span>}
              </h2>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topUsedTools} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#ffffff10" : "#e4e4e7"} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke={isDarkMode ? "#a1a1aa" : "#71717a"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke={isDarkMode ? "#a1a1aa" : "#71717a"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#ffffff05' : '#f4f4f5' }} />
                  <Bar dataKey="users" radius={[4, 4, 0, 0]} barSize={32}>
                    {topUsedTools.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ROI / Insights */}
          <div className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
            <h2 className={`mb-6 text-base font-semibold ${textTitleClass}`}>Department Activity</h2>
            <div className="space-y-4">
              {departmentCosts.slice(0, 4).map((dep, index) => {
                const depTools = tools.filter(t => {
                  let depName = t.owner_department;
                  if (!depName || depName === "undefined") depName = "Other";
                  else depName = depName.charAt(0).toUpperCase() + depName.slice(1).toLowerCase();
                  return depName === dep.name;
                });
                const depUsers = depTools.reduce((sum, t) => sum + (Number(t.active_users_count) || 0), 0);
                const avgCostPerUser = depUsers > 0 ? dep.value / depUsers : 0;
                
                return (
                  <div key={dep.name} className={`flex items-center justify-between rounded-xl border p-4 ${isDarkMode ? "border-white/5 bg-white/5" : "border-zinc-100 bg-zinc-50"}`}>
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                        <Users className="size-5" />
                      </span>
                      <div>
                        <p className={`text-sm font-medium ${textTitleClass}`}>{dep.name}</p>
                        <p className={`text-xs ${textMutedClass}`}>{depTools.length} tools • {depUsers} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${textTitleClass}`}>{formatCurrency(avgCostPerUser)}</p>
                      <p className={`text-xs ${textMutedClass}`}>avg cost / user</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
