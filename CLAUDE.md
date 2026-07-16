# TrailRadar Backend — Claude Code instructions

## Project in one line
Supabase backend for TrailRadar (legal MTB trail discovery app). No custom server — everything lives in Supabase: Postgres (tables + RLS) and Deno Edge Functions.

## Part of a larger project
This repo is the **backend only**. The frontend (Nuxt 3 app, SpotManager, map UI) lives in a sibling repo:

- `../trailstrailstrails` — frontend + its own `CLAUDE.md` with app-level context (user roles, features, architecture)

Read the frontend's `CLAUDE.md` when a task needs the client-side picture (roles, RLS rationale, how endpoints are consumed) — this file only covers the backend.

## Structure
- `supabase/config.toml` — local Supabase project config, one `[functions.<name>]` block per Edge Function
- `supabase/functions/<name>/` — one Deno Edge Function per directory, typically `index.ts` (handler) + `cors.ts` (CORS headers)
- No `supabase/migrations/` yet — schema changes are currently applied directly, not via versioned migrations

## Edge Functions
Current functions: `add-trail`, `add-visit`, `bike-parks`, `bike-parks-details`, `dirt-parks`, `dirt-parks-details`, `new-entry-abort`, `share`, `trail-description`, `trail-details`, `trail-details-feedback`.

Common pattern (see `add-visit/index.ts`):
- `Deno.serve(async (req) => { ... })`, handles `OPTIONS` for CORS first
- `getCorsHeaders(req)` from the function's local `cors.ts` on every response
- Uses `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` env vars with `createClient` from `npm:@supabase/supabase-js@2`

## Working conventions
- Ask before assuming schema/RLS intent — get this wrong and the frontend's write paths silently fail or become insecure.
- Keep CORS allowlists (`cors.ts` per function) in sync — `https://trailradar.org` is the current allowed origin.
