# TechCorp Dashboard - Jour 6

Frontend built with Next.js, React, TypeScript and Tailwind CSS.

## Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React icons

## Run locally

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

## Implemented features

### Header foundation

- TechCorp logo + title
- Navigation: Dashboard / Tools / Analytics / Settings
- Functional search input with adaptive placeholder by selected nav item
- Notifications badge with counter
- User avatar with dropdown menu (Profile, Preferences, Sign out)
- Responsive hamburger menu on mobile

### KPI cards

- Monthly Budget: `€28,750/€30k`
- Active Tools: `147`
- Departments: `8`
- Cost/User: `€156`
- Budget includes a progress bar
- Colored gradients and corner icons
- Subtle hover animation
- Responsive grid

### Recent Tools

- Columns: Tool / Department / Users / Monthly Cost / Status / Actions
- Status badges:
  - Active (green gradient)
  - Expiring (orange gradient)
  - Unused (red-pink gradient)
- Row hover effect
- Sorting on at least 2 columns (Tool, Users, Monthly Cost)
- Pagination (10 items per page)
- Actions dropdown per row (View, Edit, Delete)
- Mobile optimized stacked layout (no horizontal scrolling required)

## Project structure

- `app/` - Next.js app entry (`layout.tsx`, `page.tsx`, global styles)
- `components/` - Reusable UI components
- `data/` - Dashboard static data (cards + tools in TypeScript)

