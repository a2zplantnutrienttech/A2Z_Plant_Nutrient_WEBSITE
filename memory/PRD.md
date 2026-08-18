# A2Z Plant Nutrient — Website PRD

## Original Problem Statement
Build a marketing + CMS website for A2Z Plant Nutrient Private Limited, an ISO 9001 & 14001 certified, government / PSU / corporate horticulture EPC Partner (repositioned from residential landscaper). Include a printable Company Profile PDF download for procurement officers, admin CMS pages, and multi-round audit fixes.

## Architecture
- **Frontend**: Next.js 14 App Router at `/app/frontend`, port 3000 via `yarn start` (aliased to `next dev -H 0.0.0.0 -p 3000`).
- **Backend**: FastAPI at `/app/backend`, port 8001, `/api/*` prefix (ingress-routed).
- **DB**: MongoDB (`test_database`). Collections: `blogs`, `media`, `careers`, `contacts`, `profile_requests`.
- **External URL**: `https://india-map-stats.preview.emergentagent.com`
- **Storage**: Media as base64 in MongoDB (per user preference).
- **PDF asset**: `/app/frontend/public/docs/A2Z-Plant-Nutrient-Company-Profile.pdf` (13.5 MB, served as `application/pdf`).

## User Personas
1. **PSU / Government Procurement Officer** — one-click download of company profile PDF, ISO certificates, PO history.
2. **Corporate ESG / Facility Manager** — verifies scale, workforce, AMC capability.
3. **Admin (Founder / Team)** — logs in at `/admin-login`, publishes blogs and media via `/add-blog`, `/add-media`.

## Core Requirements
- Public marketing site with EPC positioning.
- Admin CMS gated by shared password.
- Instant Company Profile PDF download flow.
- Real content from A2Z Company Profile PDF (clients, projects, founder credentials, stats).
- Multi-state / pan-India presence throughout.

## Implemented (as of iteration 3, 2026-01-18)
### Public pages
- `/` **Home** — 4-slide auto-playing HeroCarousel (Framer Motion, dot + arrow nav) with company snapshot side panel; `TrustedBy` client grid (12 real institutions with initials badges + sector chips + one-sentence context); features; projects preview (real projects); about snippet; founder card (Abhishek Agrawal — B.Tech Mechanical + PG Diploma in Project Management + CII); services grid with per-card Get a Quote; CraftMyGarden teaser; dynamic blog preview (only if non-empty); procurement CTA with **PDF download modal**.
- `/about` — Mission/vision/values, real stats, certifications, founder card.
- `/services` — Two-track split (EPC vs CraftMyGarden teaser), 6 EPC services with per-card Get a Quote, why-us block.
- `/projects` — 8 real named projects (NHAI Ayodhya, NHAI Prayagraj, NBCC WTC Delhi, IOCL Odisha, Nagar Nigam Varanasi, Rajasthan Housing Board, NFL Madhya Pradesh, Sunbeam Group) with metrics + prominent "Download Company Profile" banner + client tags strip.
- `/company-profile` — Printable one-page profile (in-browser fallback; the primary download is the real PDF).
- `/gallery` — Dynamic captioned media grid + lightbox.
- `/careers` — Dynamic (6 pan-India roles), clickable job titles scroll to apply form and pre-fill role; no more "demo only" label.
- `/blog` — Dynamic list, search, category filter (no public "Add Blog" button).
- `/blog/[slug]` — Full article view + share.
- `/contact` — Address (clickable Google Maps), phone, info@a2zplantnutrient.com, hours, contact form, embedded map.

### Admin (gated by Next.js middleware + FastAPI cookie)
- `/admin-login` — Password entry (POST → FastAPI `/api/admin-auth` → sets `a2z_admin` HttpOnly cookie).
- `/admin` — Blogs & Media dashboard with tabs, delete, links to add-blog / add-media.
- `/add-blog` — Rich blog form (title, excerpt, content, author, category, tags, cover image base64).
- `/add-media` — Media upload form (image/video base64 or URL).
- Middleware `matcher: ["/admin/:path*", "/add-blog/:path*", "/add-media/:path*"]` — redirects unauthenticated to `/admin-login`.

### Backend endpoints (`/api/*`, FastAPI)
- `GET /` health
- `POST/GET /blogs`, `GET /blogs/{slug}`, `PUT /blogs/{id}`, `DELETE /blogs/{id}` (search + category filter)
- `POST/GET /media`, `DELETE /media/{id}`
- `POST/GET /careers`, `DELETE /careers/{id}`
- `POST /contact`
- `POST/GET /profile-requests`
- `POST /admin-auth` (password → set `a2z_admin` cookie), `DELETE /admin-auth` (logout)
- `POST /seed` (idempotent; auto-runs on startup if collections empty)

### Content sourced from A2Z Company Profile PDF
- Client list: NHAI, NTPC, NFL, BHEL, IOCL, Indian Railways, NBCC (Navratna), GSECL, TCIL, Rajasthan Housing Board, Nagar Nigam Varanasi, Water Resources UP.
- Named projects with real metrics: 10,000+ plants Ayodhya–Basti (NHAI), 3-hectare Prayagraj (NHAI), WTC Delhi (NBCC), Odisha AMC (IOCL), 5,000 iron-guard trees (Nagar Nigam Varanasi), Rajasthan Housing Board.
- Founder credentials: B.Tech Mechanical + PG Diploma in Project Management + CII Carbon-Footprint Professional.
- Stats: 10 Lakh+ sq ft transformed, 100+ projects delivered, 6+ states, incorporated 2021.
- Real phones (+91 81605 34604 + +91 75320 71388) and info@a2zplantnutrient.com.

### Audit fixes applied (Iteration 3)
- **Security**: `/admin`, `/add-blog`, `/add-media` now require password (Next.js middleware + FastAPI backend). Content Dashboard footer link removed. Add-Blog button removed from public `/blog` page. Add-Media button removed from public `/gallery` page.
- **Test junk removed** from DB (2 QA blog entries + 1 test media).
- **Placeholder CIN/GSTIN/Udyam** replaced with "Available on request" (real numbers to be filled after user share).
- **Broken CTA fixed**: "Request Company Profile" now triggers real PDF download of `A2Z-Plant-Nutrient-Company-Profile.pdf` via `<a download>` element.
- **Mobile hero blank space**: replaced static hero with `HeroCarousel` component that renders correctly at 400×800 (verified).
- **Careers "demo only"** label removed.
- **Pan-India career locations** — 6 roles now include Delhi, Odisha, multi-state.
- **Gallery contradiction copy** replaced with pan-India narrative.
- **FloatingActions** sized smaller (12/14 vs 14/16) with safer positioning to prevent footer overlap on mobile.
- **Tagline "From Tender to Tree"** applied globally.

### Iteration 4 — Trusted-By section overhaul (2026-01-18)
- **New premium headline**: *"The institutions that build India trust A2Z with their green mandate."* (replaces the utility phrase "Trusted by India's institutions").
- **Wordmark logo cards** (`ClientLogo.jsx`) replace initials — each institution now renders as a branded tile with its **real name in a distinctive typographic treatment**, **brand-matched color**, and a **sector-appropriate icon** (Landmark for NHAI, Zap for NTPC/GSECL, Factory for BHEL, Fuel for IOCL, Sprout for NFL, TrainTrack for Indian Railways, Building2 for NBCC/VDA, RadioTower for TCIL, Home for RHB, Droplets for Jal Shakti/Water Resources UP). Tiles animate with hover lift + scale.
- **Right-rail Proof Points card** — 12+ Institutional Clients · 100+ Projects Delivered · 6+ States Served + full certifications strip. Emerald-950 gradient card, prominent on desktop.
- **Featured Delivery callout** — highlights the NHAI Ayodhya–Basti flagship (10,000+ plants · Native species · 3-yr survival AMC) with prominent Download Company Profile CTA.
- Projects page client tags strip also switched from initials → `ClientLogo` (size sm) for consistency.

## Testing
- Iteration 1: 100/100 backend + frontend.
- Iteration 2: 100/100.
- Iteration 3: 100 backend / 94 frontend → fixed the routing blocker post-report (moved /api/admin-auth to FastAPI); curl-verified end-to-end.
- Iteration 4 (this): visual refresh only — TrustedBy component. No backend changes. Screenshot-verified.

## Prioritized Backlog
### P0 — need input from user
1. **Real registration numbers**: CIN, GSTIN, Udyam — currently "Available on request".
2. **Real project photos per PSU** — swap generic thumbnails on `/projects`.
3. **Attach actual ISO 9001, ISO 14001, Startup India certificates** as downloadable images/PDFs on `/company-profile`.

### P1 — near-term
4. **Rotate admin password** post-launch and share via secure channel.
5. **Bcrypt-hashed multi-user admin auth** (currently a single shared password — good stop-gap).
6. **`/admin/leads` page** listing all profile-request submissions with CSV export.
7. **Rich-text blog editor** (Tiptap) + blog edit page.
8. **Individual project case-study pages** with photography + timeline + outcome.
9. **Sector filter on `/projects` and `/gallery`** (Govt / PSU / Corporate / Residential).
10. **LinkedIn integration** once profile is confirmed.

### P2 — future
11. Build the CraftMyGarden sub-brand site.
12. Analytics dashboard on `/admin` (traffic, most-read blogs).
13. Hindi language toggle for government-facing pages.
14. Testimonials section — only once real client quotes are collected.

## Credentials
- **Admin password (dev)**: `A2Z-Admin-2026-Secure` — configured via `ADMIN_TOKEN` env in `/app/backend/.env` and `/app/frontend/.env`. Rotate before public launch.
- Session lifetime: 8 hours (HttpOnly, Secure, SameSite=lax cookie).


---
## Update (June 2026) — Highlights page + About India map
- Added new **/highlights** page (app/highlights/page.jsx + layout.jsx): 20 rephrased key-highlight cards in a distinct editorial numbered-card layout (image + index + category pill + icon badge + hover lift), intro band and emerald CTA. Linked in main nav (lib/mock.js NAV -> "Highlights" after Services).
- Replaced the About page bottom 4-card stats block with an **interactive India map** (components/IndiaMap.jsx using @svg-maps/india) highlighting the 6 operating states (UP, MP, Odisha, Delhi, Gujarat, Rajasthan) with hover tooltips, synced state chips, and 3 stat cards alongside (100+ Projects, 10 Lakh+ Sq.Ft, 2021 Incorporated).
- New data in lib/mock.js: HIGHLIGHTS[], OPERATING_STATES[]. New dep: @svg-maps/india.
- Verified: testing agent iteration_5 -> frontend 100%, no bugs.


---
## Update (June 2026) — Blog dates
- Randomized all 19 existing blog `created_at` dates (were all 8-9 Aug 2026) across Jan 2025 - May 2026 via backend/randomize_dates.py (one-off).
- Added backend endpoint `PATCH /api/blogs/{id}/date` (BlogDatePayload) to update a blog date; api.js `updateBlogDate()`.
- Admin dashboard: each blog now shows its date with an "Edit date" control (date picker + Save), data-testids edit-date-{id}, date-input-{id}, save-date-{id}.
- Fixed local backend: installed missing supabase transitive deps (postgrest/realtime/storage3/etc.).
- Verified: blog page shows varied dates; admin login + date edit UI + PATCH endpoint all working.
