# THE SHIESTY FILE

A classified-intelligence-terminal experience for Project Shiesty.

> You don't receive your stripes. You earn them.

## Flow

Landing → Enter X Handle → Intelligence Scan → Operative File →
Mission 001 (find the hidden mark) → Stripe Earned → Shareable
Operative Card → The Shiesty Wall

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- html-to-image (for the downloadable operative card)
- Local JSON-file data store (see below) — designed as a drop-in
  swap for Supabase

## Project structure

```
src/
  app/
    page.tsx                     Screen 1 — Landing
    identify/page.tsx            Screen 2 — Enter X handle
    scan/page.tsx                Screen 3 — Intelligence scan
    file/page.tsx                Screen 4/7 — Operative file
    mission/[missionNumber]/     Screen 5/6 — Mission + stripe earned
    share/page.tsx               Shareable operative card
    wall/page.tsx                Screen 8 — The Shiesty Wall
    api/
      identify/route.ts          Create/fetch operative by handle
      complete-mission/route.ts  Award stripes, block duplicates
      operative/route.ts         Fetch one operative
      wall/route.ts              List all operatives
  components/                    Reusable UI (OperativeFileCard, etc.)
  data/
    ranks.ts                     Rank thresholds — edit here only
    missions.ts                  Mission definitions — edit here only
    copy.ts                      Shared microcopy strings
  lib/
    store.ts                     Data layer (see Supabase section)
    types.ts                     Shared types matching the DB schema
```

## Editing ranks or missions

Both are centralized config objects — no rank/mission logic is
hardcoded elsewhere in the app.

- Add or rename ranks in `src/data/ranks.ts`
- Add new missions in `src/data/missions.ts` (each mission just
  needs a number, copy, and a stripe reward — the mission page,
  API, and DB schema all already support any number of missions)

## Swapping in real Supabase

The entire data layer lives in `src/lib/store.ts` and exposes five
functions: `getOrCreateOperative`, `getOperative`,
`hasCompletedMission`, `completeMission`, `getWall`. Nothing in
`src/app/api/*` talks to storage directly — it only calls these
functions. To go live on Supabase:

1. Create the three tables from the original spec:
   - `operatives(id, operative_number, x_handle, stripes, rank, clearance_level, missions_completed, created_at, updated_at)`
   - `missions(id, mission_number, title, description, stripe_reward, active, created_at)`
   - `operative_missions(id, operative_id, mission_id, completed, completed_at)` with a unique constraint on `(operative_id, mission_id)` to enforce no-duplicate-completion at the DB level too
2. Add a Supabase client (`@supabase/supabase-js` is already installed) and env vars for `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.
3. Rewrite the five functions in `store.ts` to query Supabase instead of the local JSON file. The function signatures and return shapes are already exactly what the API routes expect — no other file needs to change.

Until that swap happens, data is stored in a local `.data/db.json`
file (gitignored), which resets whenever that file is deleted. This
is fine for demoing the full flow but is **not** durable storage —
do the Supabase swap before a real public launch.

## Notes on the hidden mark (Mission 001)

The findable mark is a small triangle (▲) tucked into the
"CLASS" stamp in the mission briefing card. It's a real tappable
button (not hover-only), so it works on mobile. Swap its
appearance/position in `src/app/mission/[missionNumber]/page.tsx`
and `src/components/HiddenMark.tsx` whenever you want to refresh
the puzzle for a new mission.

## What's not wired in yet

- Real Supabase persistence (see above)
- X OAuth (spec explicitly asks to skip this for v1 — handle is
  self-reported)
- Sound effects (spec makes them optional/off by default)
