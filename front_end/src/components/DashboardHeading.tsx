interface DashboardHeadingProps {
  isDarkMode: boolean;
}

export default function DashboardHeading({ isDarkMode }: DashboardHeadingProps) {
  return (
    <div className="mb-8">
      <h1
        className={`text-3xl font-bold tracking-tight md:text-4xl ${isDarkMode ? "text-white" : "text-zinc-900"}`}
      >
        Internal Tools Dashboard
      </h1>
      <p className={`mt-2 text-sm md:text-base ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
        Monitor and manage your organization&apos;s software tools and expenses
      </p>
    </div>
  );
}
