# TechCorp Dashboard - Internal Tools Management

Frontend built with Next.js, React, TypeScript and Tailwind CSS.
This project implements a 3-day technical challenge to build a complete SaaS monitoring dashboard.

## Stack

- Next.js (Pages Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React icons
- Recharts (for data visualization)
- next-themes (for dark/light mode persistence)

## Backend

- Base URL: `https://tt-jsonserver-01.alt-tools.tech`
- Main endpoints used:
  - `GET /tools`
  - `GET /departments`
  - `POST /tools`
  - `PATCH /tools/:id`

## 🚀 Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## 🏗️ Architecture

The project is structured around the Next.js Pages router to handle the 3 main views:

- `src/components/` - Reusable design system components (Navbar, StatCards, Tables, Badges)
- `src/pages/` - The main views: `index.tsx` (Dashboard), `tools.tsx` (Catalog), `analytics.tsx` (Insights)
- `src/hooks/` - Custom React hooks like `useToolsData` for data fetching and live polling
- `src/utils/` - API helpers, constants, and shared TypeScript interfaces
- `src/styles/` - Global styling and Tailwind configuration

## 🎨 Design System Evolution

The design system was established on Day 6 using a modern dark theme with subtle gradients (purple/blue/pink/emerald) and Lucide icons. 
For Days 7 and 8, this exact design language was strictly maintained without new mockups:
- The same `AppNavbar` is reused across all pages.
- The `StatCard` component from the Dashboard is reused on the Analytics page.
- The `StatusBadge` component is reused in the Tools catalog.
- Forms, modals, and dropdowns share the exact same border radii (`rounded-xl`, `rounded-2xl`), background colors, and hover states.
- A global `next-themes` provider ensures dark/light mode preferences persist seamlessly across page navigations.

## 🔗 Navigation & User Journey

The flow is completely seamless:
- **Dashboard (/)**: High-level overview and recent tools.
- **Tools (/tools)**: Deep dive into the catalog with full CRUD capabilities.
- **Analytics (/analytics)**: Data visualization and insights.
- **Cross-page links**: Optimization alerts on the Analytics page link directly back to the Tools page for quick action. Tools on the catalog page have a quick-action button to view their analytics.

## 📊 Data Integration Strategy

Data is fetched from the provided JSON server using the native `fetch` API wrapped in custom utility functions (`src/utils/api.ts`). 
A custom hook (`useToolsData`) manages the loading, error, and success states. It also supports background polling for real-time updates without blocking the UI.

## 📱 Progressive Responsive Design

A mobile-first approach was taken using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`):
- **Mobile (< 640px)**: Stacked layouts, hamburger menus. Complex tables (like the Tools catalog) transform into stacked cards to avoid horizontal scrolling and provide larger tap targets.
- **Tablet (640-1024px)**: 2-column grids for charts and KPIs.
- **Desktop (> 1024px)**: Full multi-column layouts utilizing the maximum screen width.

## 📈 Data Visualization Philosophy

`recharts` was chosen for the Analytics page because it is highly customizable, responsive, and integrates perfectly with React.
- The charts use the exact same color palette as the rest of the application (Tailwind's violet, emerald, rose, blue).
- Custom tooltips were built to match the dark mode styling of the application's dropdowns and modals.
- Interactive drill-downs allow users to click on a department in the Pie Chart to instantly filter the surrounding bar charts.

## 🔮 Next Steps / Complete App Vision

Future improvements for a complete SaaS Tools app could include:
- **Authentication**: Implementing NextAuth to secure the dashboard.
- **Role-Based Access Control**: Different views for IT Admins vs Department Managers.
- **Advanced Caching**: Migrating from native `fetch` to TanStack Query (React Query) for advanced cache invalidation and optimistic UI updates.
- **Settings Page**: Fleshing out the `/settings` route to manage global application preferences.

