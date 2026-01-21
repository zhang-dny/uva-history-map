# Project Context: UVA History Map App

## 1. Project Overview
**Goal:** Build an interactive, web-based map application for the UVA History sector.
**Core Value:** A public-facing map where users can explore historical buildings at UVA. Admins can easily add points, edit details, and upload images to keep the history alive.
**Deadline:** January 31, 2026 (12-Day Sprint).

### Roles
* **Viewer (Public):** Can pan/zoom the map, click markers to see details (images/history), filter by tags, and search.
* **Admin (Authenticated):** Can do everything a viewer can + add/edit/delete building points, upload images, and manage content.

## 2. Tech Stack (Strict)
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript (Strict Mode)
* **Styling:** Tailwind CSS + `shadcn/ui` (Components)
* **Map Engine:** `react-map-gl` (MapLibre wrapper) + MapTiler (Vector Tiles)
* **Backend/DB:** Supabase (PostgreSQL + PostGIS + Auth + Storage)
* **State Management:** `nuqs` (URL query params for shareable state) + React Query (caching)
* **Forms:** `react-hook-form` + `zod` (Validation)

## 3. Architecture & Standards
### Database Schema (Supabase)
* **`buildings` table:**
    * `id` (bigint, PK)
    * `title` (text)
    * `description` (text)
    * `location` (geography(POINT)) -- PostGIS
    * `tags` (jsonb/array)
    * `created_at`, `updated_at`
* **`images` table:**
    * `id` (bigint, PK)
    * `building_id` (FK -> buildings.id)
    * `url` (text)
    * `caption` (text)

### Coding Rules for Cursor (AI)
1.  **Server Actions First:** Do NOT create API routes (`pages/api` or `app/api`) unless absolutely necessary. Use Next.js Server Actions for all DB mutations.
2.  **Shadcn UI:** Always use `shadcn/ui` components for UI elements (Buttons, Dialogs, Inputs, Sheets).
3.  **Strict Types:** Never use `any`. Always define interfaces in `types/database.ts` or infer them from Zod schemas.
4.  **Map Logic:** Keep map rendering logic inside `components/map`. Isolate direct `maplibre-gl` references to prevent SSR crashes.
5.  **Env Variables:** Always refer to `process.env.NEXT_PUBLIC_SUPABASE_URL` etc. safely.
5. **Coding Practices** Ensure good coding practices, such as DRY adn WET, Modulation, Loose Coupling etc. 

## 4. Master Roadmap (Jan 20 - Jan 31)

### Phase 1: Foundation (Jan 20-22)
* [x] **Jan 20:** Repo setup, Next.js init, CI/CD (GitHub Actions + Vercel).
* [x] **Jan 21:** Supabase Setup. Enable PostGIS. Create `buildings` and `images` tables. RLS Policies.
* [ ] **Jan 22:** Auth & Layouts. Login page (Supabase Auth). Main AppShell (Sidebar + Map Container).

### Phase 2: The Map Experience (Jan 23-25)
* [ ] **Jan 23:** Map Component. Install `react-map-gl`. Render basic map with MapTiler style.
* [ ] **Jan 24:** Data & Clustering. Fetch points via Server Action. Implement Supercluster for overlapping markers.
* [ ] **Jan 25:** Interactivity. Click marker -> Update URL (`?id=123`) -> Open Sidebar Detail View (using `nuqs`).

### Phase 3: Admin Features (Jan 26-28)
* [ ] **Jan 26:** "Add Mode". Admin toggle. Click map to capture Lat/Lng. Open Zod Form.
* [ ] **Jan 27:** Image Uploads. Drag & Drop zone. Resize client-side. Upload to Supabase Storage. Link to Building ID.
* [ ] **Jan 28:** Edit/Delete. Admin-only buttons in detail view. Server Actions for `update` and `delete`.

### Phase 4: Polish & Launch (Jan 29-31)
* [ ] **Jan 29:** Search & Filter. Command Palette (CMDK) for fuzzy search. Filter pills for tags.
* [ ] **Jan 30:** UI Polish. Mobile responsiveness (Drawer vs Sidebar). Loading states.
* [ ] **Jan 31:** Final Deploy. SEO tags. Production database backup. Handoff.

