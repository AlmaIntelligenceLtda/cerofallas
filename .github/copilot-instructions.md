# Copilot / AI Agent Instructions — Cerofallas

Short, actionable guidance to help AI contributors be productive editing and extending this Expo + React Native app.

- **Project type & entry points:** Expo app using `expo-router`. Main entry is `app/index.tsx` and layout is `app/_layout.tsx` (Clerk auth + Redux Provider). Native Android lives under `android/` for manual gradle tasks.

- **Run / build commands:**
  - Dev (mobile/web): `npm run start` (alias runs `expo start`) or `npm run web` for web.
  - Android local: `npm run android` -> runs `expo run:android` (uses `android/gradlew` for native builds).
  - Prebuild/EAS: `npm run prebuild` and use `eas build` for production native builds (see `eas.json`).
  - Lint/format: `npm run lint`, `npm run format`.

- **Auth & env:** Uses Clerk (`@clerk/clerk-expo`). Required env vars:
  - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` — used in `app/_layout.tsx` (throws if missing).
  - Server base URL used by `lib/fetch.ts` (expects `EXPO_PUBLIC_SERVER_URL` / BASE_URL). Ensure `.env` or environment provisioning matches.

- **State management:** Redux Toolkit + `redux-persist` with `AsyncStorage`. Store definition: [store/index.ts](store/index.ts#L1-L30). Use `useAppDispatch()` and `useAppSelector()` helper types exported from `store/index.ts`.

- **Routing conventions:** File-system routing with `expo-router`. Routes use folder names (note special groups with parentheses): `(auth)`, `(root)`, `(tabs)`. Examples:
  - Redirect to home: `/ (root)/(tabs)/home` (see `app/index.tsx`).
  - Layout registers screens by folder name in `app/_layout.tsx`.

- **API patterns:**
  - Use `lib/fetch.ts` helpers: `fetchAPI(path, options)` for JSON and `fetchFormAPI(path, formData)` for multipart uploads. Example:
    - `const data = await fetchAPI('/api/endpoint', { method: 'GET' });`
    - `await fetchFormAPI('/upload', formData);` (do not set `Content-Type` for FormData)
  - `fetch.ts` currently uses a hardcoded BASE_URL — update to read from env if changing.

- **File uploads & images:** Image/photo flows use `expo-camera`, `expo-image-picker` and `fetchFormAPI` for uploads. Check `components/RegistroFotografico.tsx` and `lib/fetch.ts` for the pattern.

- **PDFs & printing:** PDF generation templates live in `lib/pdfTemplates.ts` and `pdfkit` is a dependency. For printing/sharing use `expo-print` and `expo-sharing` as used in `lib/pdfTemplates.ts`.

- **Realtime & external integrations:** Ably is used for realtime (`lib/ably.ts`). Database/server interactions happen via a Postgres server (see `pg` dep) and a server at the BASE_URL endpoint in `lib/fetch.ts`.

- **Native specifics:** If editing native code, use `android/gradlew.bat` on Windows and follow `expo prebuild` / EAS conventions. Avoid changing native code unless necessary for a feature.

- **Coding conventions / formatting:** ESLint extends `universe/native`. Use `npm run lint` and `npm run format` before PR. Tailwind styles via `nativewind` and `global.css` (see `tailwind.config.js`). Keep components functional and prefer hooks patterns (see `lib/*` and `hooks/`).

- **Where to look for examples:**
  - Auth flow: `app/(auth)` folder (sign-in / sign-up / welcome pages).
  - App flows and tabs: `app/(root)/(tabs)` (home, pendientes, profile, documentos).
  - Store slices: `store/*.ts` (authSlice.ts, conectividadSlice.ts, mantenimientoSlice.ts, strSlice.ts).
  - Network helpers: `lib/fetch.ts`, `lib/auth.ts`, `lib/map.ts`, `lib/pdfTemplates.ts`.

- **What to avoid / be careful about:**
  - Do not change `ClerkProvider` initialization without preserving `tokenCache` usage (see `lib/auth.ts`) — this impacts persisted auth.
  - `fetchFormAPI` must not set `Content-Type` for FormData requests.
  - The project mixes web and native targets — check `expo` vs `react-native-web` compatibility when touching UI components.

- **Examples to copy/paste:**
  - Dispatch example: `const dispatch = useAppDispatch(); dispatch(someAction(payload));`
  - Selector example: `const member = useAppSelector(s => s.auth.member);`

If anything above is unclear or you want more examples (e.g., common PR changes, tests to run, or a walkthrough for adding a screen), tell me which area to expand. Ready to iterate on wording or add missing references.
