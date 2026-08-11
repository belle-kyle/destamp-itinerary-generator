# Destamp Itinerary Generator — Ideas

## What this repo is

A **Turborepo + pnpm monorepo** for a Philippine travel app with two user roles:

| Layer | Stack |
|---|---|
| Mobile app | Expo SDK 49 · expo-router · TypeScript · Tailwind (NativeWind) · Apollo Client |
| API | GraphQL via **Nexus** (codegen, schema-first `schema.graphql`) |
| Data | Prisma 5 + Postgres (Supabase) |
| Auth | Supabase (SecureStore adapter) + Clerk in deps (unused?) |
| Maps | Mapbox service (`packages/db/src/service/mapboxService.ts`) |
| Tests | Jest — server (`packages/db`) + Expo components (`__test__/`) |
| CI | GitHub Actions (`pnpm build` on main + PRs) |

### Core domain
- **Travelers** — create trips from preferences (budget, travel size, categories) → generated **daily itineraries** of POIs; track **expenses**; claim **stamps** at visited POIs (digital passport); premium subscription gates trip regeneration.
- **Business operators** — multi-step onboarding for restaurants / accommodations / attractions (basic info → establishment type → facilities → opening hours → images → business permit → overview), plus edit flows and a public business profile page.
- Seed data: `packages/db/prisma/{restaurantsv3,accommodationsv3,attractions}.json`.

### Schema at a glance
`User, Traveler, Subscription, Trip, TripPreference, PointOfInterest, Restaurant, Accommodation, Amenity, Category, OperatingHour, DailyItinerary, DailyItineraryPoi, Expense, Image, PoiImage, Stamp`

Mutations: create/regenerate trip, claim stamp, subscribe/cancel premium, full CRUD on POIs/expenses, edit user.
Queries: trips, trip, POIs, categories, unclaimed stamps, traveler account.

---

## Quick fixes (low effort, high signal)

1. **Stale workspace config** — `pnpm-workspace.yaml` lists `packages/api` and `packages/auth`, but neither directory exists. Either create them or drop them from the glob. `pnpm install` may resolve it fine, but it's dead config.
2. **README drift** — "Dynamic API querying with Prisma and GraphQL" is vague; README lacks the traveler/business dual-role explanation and the `.env` requirements. Worth a rewrite that matches the actual scripts (`db:push`, `generate`, `test:server`).
3. **Duplicate typo risk** — `accommodationCategoires` / `attractionCategoires` / `restaurantCategoires` are misspelled in the public GraphQL schema. Renaming is breaking, so at minimum add aliases and stop compounding the typo in new code.
4. **Auth stack ambiguity** — Supabase auth is wired in `config/initSupabase.ts` but `@clerk/clerk-expo` is in deps. Pick one; dead auth SDKs are a security audit smell.
5. **`packages/db` is the server** — the API lives in the `db` package (Nexus schema in `src/graphql/`). Naming is confusing; a `packages/api` rename or at least a README note would help onboarding.

## Product ideas

6. **Stamp claim → verification loop** — `claimStamp` is just a mutation on an ID. Add QR/NFC check-in (operator presents code, traveler scans), geofence validation via Mapbox, and a "stamps collected this trip" summary on the itinerary. This is the app's differentiator — make it a real passport.
7. **Itinerary engine explainability** — `regenerateTrip` exists but travelers can't see *why* a POI was chosen. Surface the matching score (category fit × budget × travel size × distance) per day so regeneration feels like steering, not shuffling.
8. **Operators: analytics dashboard** — they already publish hours, facilities, permits. Add views/stamps-per-week for their POI, and a "claimed by travelers" feed. Feeds the business tier's retention.
9. **Trip sharing / social** — shared trip links (public read-only view) is the cheapest viral loop; pairs with stamps for bragging rights.
10. **Offline mode** — the whole flow is network-bound (Apollo + Supabase). Cache generated itineraries + maps offline; travelers are on buses/ferries in the Philippines — this is a real retention win.

## Architecture ideas

11. **Migrate off Nexus** — Nexus is in maintenance mode (v1.3, unmaintained since ~2021). Pothos or GraphQL Yoga + `graphql-scalars` is the current path; do it incrementally while the schema is still small.
12. **Type sharing** — Expo runs `graphql-codegen`, server uses Nexus types; the `packages/config/typescript` shared config exists but there's no shared types package. A `packages/contracts` (generated from the GraphQL schema) would kill the drift between client queries and server types.
13. **Test the itinerary generator** — server tests exist but the highest-value logic (itinerary assembly, budget allocation, stamp eligibility) is the least tested. Property-test the generator: any valid preference set must produce N daily itineraries, no duplicate POIs, budget not exceeded.
14. **Secrets hygiene** — Supabase anon key + Mapbox token flow through `Constants.expoConfig.extra`. Verify `.env` / `.env.example` is gitignored properly and secrets aren't baked into EAS builds.
15. **`isBusinessOperator` guard** — recent commits added authorization checks for creating expenses/POIs/trips. Finish the sweep: audit every mutation for the role check, and centralize it in an auth context instead of per-resolver.

## One-line pitch ideas

- "TripStamp" — itinerary + digital passport, the anti-tripadvisor for the Philippines
- Business tier: verified operators pay to be featured in generated itineraries (matches existing premium subscription)
- Group trips: split expenses (Expense model already exists) + shared stamp book
