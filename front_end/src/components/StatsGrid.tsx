import type { StatItem } from "../utils/dashboardData";
import StatCard from "./StatCard";

interface StatsGridProps {
  stats: StatItem[];
  isDarkMode: boolean;
}

export default function StatsGrid({ stats, isDarkMode }: StatsGridProps) {
  return (
    <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard key={item.label} item={item} isDarkMode={isDarkMode} />
      ))}
    </section>
  );
}
