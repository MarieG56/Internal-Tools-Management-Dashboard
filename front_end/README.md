# TechCorp Dashboard - Jour 6/7

Frontend built with Next.js, React, TypeScript and Tailwind CSS.
Jour 7 includes a backend-connected Tools catalog using JSON Server.

## Stack

- Next.js (Pages Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React icons

## Backend

- Base URL: `https://tt-jsonserver-01.alt-tools.tech`
- Main endpoints used:
  - `GET /tools`
  - `GET /departments`
  - `POST /tools`
  - `PATCH /tools/:id`

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

### Jour 7 - Tools Page (`/tools`)

- Backend-connected tools catalog
- Advanced filters:
  - Department
  - Status
  - Category
  - Cost range (min/max)
- Header search adapted to tools catalog
- Tool management:
  - Add new tool (modal + validation)
  - View details (modal)
  - Edit tool (modal)
  - Enable/Disable status toggle
- Bulk operations:
  - Enable selected
  - Disable selected
  - Mark Expiring
- Loading, error and empty states consistent with Day 6 design

## Project structure

- `src/components/` - Reusable design system components
- `src/pages/` - Dashboard, Tools, Analytics, Settings pages
- `src/hooks/` - Data fetching logic
- `src/utils/` - API helpers, constants and shared types
- `src/styles/` - Global styling (Tailwind entry)

# TechCorp Dashboard - Jour 6/7

Frontend built with Next.js, React, TypeScript and Tailwind CSS.
Jour 7 includes a backend-connected Tools catalog using JSON Server.

## Stack

- Next.js (Pages Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React icons

## Backend

- Base URL: `https://tt-jsonserver-01.alt-tools.tech`
- Main endpoints used:
  - `GET /tools`
  - `GET /departments`
  - `POST /tools`
  - `PATCH /tools/:id`

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

### Jour 7 - Tools Page (`/tools`)

- Backend-connected tools catalog
- Advanced filters:
  - Department
  - Status
  - Category
  - Cost range (min/max)
- Header search adapted to tools catalog
- Tool management:
  - Add new tool (modal + validation)
  - View details (modal)
  - Edit tool (modal)
  - Enable/Disable status toggle
- Bulk operations:
  - Enable selected
  - Disable selected
  - Mark Expiring
- Loading, error and empty states consistent with Day 6 design

## Project structure

- `src/components/` - Reusable design system components
- `src/pages/` - Dashboard, Tools, Analytics, Settings pages
- `src/hooks/` - Data fetching logic
- `src/utils/` - API helpers, constants and shared types
- `src/styles/` - Global styling (Tailwind entry)

