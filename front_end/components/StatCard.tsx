import type { StatItem } from "../data/dashboardData";

interface StatCardProps {
  item: StatItem;
  isDarkMode: boolean;
}

export default function StatCard({ item, isDarkMode }: StatCardProps) {
  const Icon = item.icon;
  const containerClass = isDarkMode
    ? "border-white/10 bg-[#0b0b0f]"
    : "border-zinc-200 bg-white shadow-sm";

  return (
    <article
      className={`rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-0.5 ${containerClass} sm:p-5`}
    >
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <p className={`text-xs font-medium sm:text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
          {item.label}
        </p>
        <span className={`flex size-8 items-center justify-center rounded-xl sm:size-9 ${item.iconClass}`}>
          <Icon className="size-3.5 sm:size-4" />
        </span>
      </div>

      <div>
        <p
          className={`text-2xl font-bold tracking-tight sm:text-[1.625rem] ${isDarkMode ? "text-white" : "text-zinc-900"}`}
        >
          {item.value}
          {item.valueAccent && (
            <span className={`ml-1 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
              {item.valueAccent}
            </span>
          )}
        </p>
        <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold sm:mt-3 sm:px-2.5 sm:py-1 sm:text-xs ${item.badgeClass}`}>
          {item.badge}
        </span>
        {typeof item.progress === "number" && (
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>
    </article>
  );
}
