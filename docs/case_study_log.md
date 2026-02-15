# Afterword — Case Study Log

A running record of product decisions, technical choices, and portfolio-ready milestones. Updated after major features or fixes per the Always-On Documentation Rule (see bottom).

---

## Project Origins & Foundations

### The Rebuild Strategy

Afterword was scaffolded as a **clean Next.js + Tailwind** application, using an external **lovable-reference** (or equivalent design reference) as a **visual blueprint** rather than copying its codebase. The approach:

- **Next.js App Router** for routes, layouts, and server/client boundaries.
- **Tailwind CSS v4** with a custom design system in `app/globals.css`: CSS variables for a warm, literary palette (cream, charcoal, pencil-gray, sage-green, dusty-blue, warm-brown), `@theme inline` for Tailwind integration, and utility classes (e.g. `.paper-texture`, `.btn-sketchy`, `.font-display`, `.font-body`).
- **Typography**: Playfair Display (display) and Libre Baskerville (body) via `next/font` to support the analog, editorial aesthetic.
- **No legacy stack carryover**: New `package.json`, clean `app/` and `components/` structure, and intentional separation between marketing, scan, and recommendations flows.

*Why this approach:* A reference provides visual and UX direction without locking in someone else’s architecture or dependencies. We keep full control over upgrade path (e.g. Next 16, React 19) and can evolve the design system in one place.

---

### Current Feature Set (Audit Snapshot)

**Tech stack**

- **Runtime**: Node (project uses `@types/node` ^20; no explicit engines in `package.json`).
- **Framework**: Next.js 16.1.6 (Turbopack), React 19.2.3.
- **Styling**: Tailwind CSS ^4, PostCSS.
- **Language**: TypeScript ^5.
- **Key dependency**: OpenAI ^6.22.0 for the shelf-analysis pipeline.

**Landing experience**

- **`app/page.tsx`**: Composes `HeroSection`, `TornPaperDivider`, `FeaturesSection`, `Footer` on a `paper-texture` background.
- **`components/marketing/HeroSection.tsx`**: Headline “Your bookshelf is just the beginning,” supporting copy, book illustration, and primary CTA linking to **/scan** (“Scan Your Shelf & Get Recommendations”).
- **`components/marketing/FeaturesSection.tsx`**: Three feature blocks (Discover, Connect, Experience) with custom icons and pencil-divider separators; layout uses `items-stretch` for consistent card height.
- **`components/marketing/TornPaperDivider.tsx`**: Visual break using torn-paper asset.
- **`components/marketing/Footer.tsx`**: Site footer (links, branding).

**Login UI**

- **`app/login/page.tsx`**: Centered card with Afterword logo, Email and Password inputs, hand-drawn corner-cap imagery (top-left and bottom-right per field), reduced border-radius to match cap curves, Sign In link to dashboard, Sign Up and Back to home links.
- Styling: `.input-page-corner`, `.input-with-corner-caps` (3px radius), corner images served from `/assets/corner-cap.png` with `unoptimized` to preserve transparency.

**Dashboard structure**

- **`app/dashboard/page.tsx`**: Post-login placeholder dashboard. Category grid (Books, Movies and TV, Music, Events) with horizontal scroll rows; placeholder images from placehold.co; `TornPaperDivider` and `Footer`. Uses shared typography and color tokens (e.g. `text-charcoal`).

**Scan → Analyze → Results flow**

- **`app/scan/page.tsx`**: Mobile-first capture flow; steps: capture → preview → processing. Uses `ImageCapture`, `UploadPreview`, `ProcessingState`; POSTs image to `/api/analyze`, stores result and image URL in sessionStorage, redirects to `/results`.
- **`app/results/page.tsx`**: Reads analysis from sessionStorage; renders `RecommendationsView` (taste profile + Books, Films, Music, Events, Unexpected) or fallback “Go to Scan” if missing.
- **`app/api/analyze/route.ts`**: Accepts image via FormData; MVP uses mock extracted titles (no OCR); calls `lib/ai/analyzeShelf.ts`; returns structured JSON; in-memory per-IP rate limit (10/hour) with `X-RateLimit-*` and `Retry-After` headers.
- **`lib/ai/analyzeShelf.ts`**: OpenAI `gpt-4o-mini` with structured JSON (taste_profile, recommendations); literary/editorial system prompt.
- **`components/scan/*`**: ImageCapture (file input with `capture="environment"`), UploadPreview, ProcessingState (literary loading copy).
- **`components/recommendations/RecommendationsView.tsx`**: Renders taste profile and recommendation cards (title, creator, explanation, why_it_connects) in a single-column, mobile-first layout.

**Supporting lib and types**

- **`lib/types.ts`**: Shared types for `AnalyzeShelfResponse`, `TasteProfile`, `Recommendations`, `RecommendationItem`.
- **`lib/rateLimit.ts`**: In-memory per-IP rate limiting and client IP extraction from request headers.
- **`lib/supabase/client.ts`**, **`lib/mock-recommendations.ts`**, **`lib/ai/recommendations.ts`**, **`lib/integrations/placeholder.ts`**: Present for future or alternate flows (e.g. Supabase, placeholder APIs).
- **`app/api/recommendations/route.ts`**: Additional API route (e.g. for non-scan recommendations).

**Design system (high level)**

- **globals.css**: `.paper-texture` (cream background + noise overlay), `.btn-sketchy` (bordered, hand-drawn-style button), `.pencil-divider` (vertical gradient line), dark mode via `prefers-color-scheme`.

---

### The “Saga” Retrospective: Node Version & Repository Recovery

The repository history and reflog indicate a **transition from a problematic state to the current working state**, involving:

1. **Node version and environment**  
   At some point the project (or tooling) was run under **Node v25** (or another incompatible version), which can cause install or runtime issues with Next.js, ESLint, or native deps. The codebase does not pin Node in `package.json`; tooling (e.g. ESLint, Next) generally expects Node 18+ or 20 LTS. *Resolution:* Aligning on a stable Node version (e.g. 20 LTS) for local and CI avoids “works on my machine” and build failures.

2. **Repository sync and duplicates**  
   A commit **“chore: moved project to local drive and cleaned sync duplicates”** suggests the repo had been synced across environments (e.g. cloud drive) and accumulated duplicate or conflicting files (e.g. “.gitignore 2”). Cleaning duplicates and moving to a single source of truth (local drive) reduced confusion and merge noise.

3. **Git reset and force push**  
   The reflog shows **`reset: moving to HEAD~1`** (undoing one commit), and the current branch history is linear. To restore a clean history after failed merges or bad commits, a **git reset** (e.g. `git reset --hard <good-commit>`) followed by a **force push** (`git push --force-with-lease origin main`) was likely used to make the remote match the desired state. *Why force push:* Necessary when the remote had commits we intentionally discarded; `--force-with-lease` is safer than `--force` because it refuses to overwrite if the remote has new commits we haven’t seen.

**Takeaway:** Document the target Node version (e.g. in README or `.nvmrc`) and avoid syncing the project folder via cloud drive to prevent duplicate files and history issues. Use force push only when deliberately rewriting shared history, and prefer `--force-with-lease`.

---

## Always-On Documentation Rule

From this point forward, the following protocol applies:

1. **Automatic updates**  
   After every **major feature implementation** or **bug fix**, append a **new dated entry** to this log. Each entry should include:
   - Short title and date.
   - What changed (features, routes, components, or fixes).
   - **Technical reasoning**: the “why” behind a choice (e.g. “Used `unoptimized` on corner-cap images so Next.js image optimization does not strip PNG transparency.”).
   - **Case study suggestions**: specific screenshots or flows that would strengthen a portfolio (e.g. “Capture the scan UI on mobile next to the results screen to show the end-to-end flow.”).

2. **Tone and audience**  
   Write for a **Senior Product Engineer / Technical Writer** audience: clear, concise, and useful for future you or for portfolio case studies.

3. **Placement**  
   New entries go **below** this rule and **above** any “Future work” or appendix sections you add later.

---

*(New entries appear below this line.)*

---

### 2025-02-15 — Case study log and documentation protocol

**What changed**  
- Added `docs/` and `docs/case_study_log.md`.  
- Populated **Project Origins & Foundations** (rebuild strategy, current feature set, Node/repo saga).  
- Defined the **Always-On Documentation Rule** for future entries.

**Why**  
- A single running document makes it easier to write a portfolio case study or handoff doc without reconstructing history.  
- Capturing the “saga” (Node version, sync duplicates, reset/force push) prevents repeat mistakes and explains past repo state.

**Case study suggestion**  
- Screenshot or short video: **Landing → Scan → Processing → Results** on one screen (or split: mobile scan UI vs desktop results) to show the full no-login flow and literary loading/recommendations UX.
