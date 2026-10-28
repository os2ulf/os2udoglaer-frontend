# Nuxt 4 Minimal Starter

Look at the [Nuxt 4 documentation](https://nuxt.com/docs/4.x/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:
Dev environment should be: https://localhost:3000 or change it in useBaseApi.ts file.

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Linting

Use Node.js 24.22.1 (`nvm use`) and install dependencies first. The install step
generates Nuxt's project-aware ESLint configuration.

```bash
npm run eslint
npm run eslint:fix
npm run stylelint
npm run stylelint:fix
npm run typecheck
```

ESLint checks JavaScript, TypeScript, and Vue source files, excluding generated
output and vendored assets. Formatting remains managed by Prettier. Existing
unused declarations and migration suggestions are reported as warnings; the
configuration does not require a full typing migration of CMS responses.

Stylelint checks CSS and Vue styles, excluding generated output and vendored
assets. Its configuration permits the project's Sass-style BEM nesting,
intentional cascade overrides, and existing wrapping/native-control styles.

TypeScript uses Microsoft's [side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60):
`@typescript/native` aliases TypeScript 7.0.2 and provides the `tsc` command.
`typescript` aliases the official `@typescript/typescript6` compatibility package,
which supplies the TypeScript 6 compiler API required by Vue tooling and
typescript-eslint, plus the `tsc6` command. Keep both aliases until those tools
support the native compiler API; replacing the compatibility alias with stock
TypeScript 7 breaks their programmatic imports.

Editors that need the classic workspace `tsserver` for Vue should select the SDK
at `node_modules/@typescript/old/lib`; the compatibility package re-exports that
same API but does not include its own `tsserver.js` executable.

Run `npm run typecheck` to regenerate Nuxt's types and check ordinary TypeScript
files with the native compiler. `npx tsc6 --noEmit` checks the same files with the
compatibility compiler. Vue Single File Component tooling continues to use the
compatibility API; this command does not check Vue templates.

The `crossws` development dependency supplies the ESLint config inspector's
optional WebSocket peer. Nuxt/Nitro retain their own compatible 0.3 dependency;
without the explicit 0.4 peer, npm incorrectly resolves the inspector to 0.3.

## Search checks

Run `npm test` for the component and search-query regression tests. `npm run eslint`
also fails on warnings.

To test locally against production content without changing `.env`:

```bash
nvm use
NUXT_PUBLIC_LOCAL_API_BASE_URL=https://api.ulfiaarhus.dk npm run dev
```

Production search pages include `/grundskole-0` and `/udbydere`. Search keywords,
filters, sorting, dates, pagination, and the map/list choice are stored in the URL
and restored on reload or back-navigation. Map links use `mode=map`; switching
back to the list removes it while keeping the other search settings.
Panning or zooming saves `map_lat`, `map_lng`, and `map_zoom` in the URL. Both maps
restore that position after reload, result navigation, or switching views.
Links without valid map coordinates fit the matching locations automatically.
Selecting a marker saves `map_marker` and reopens its popup after reload or Back,
including markers inside a cluster. Closing the popup or filtering out the marker
clears the selection while keeping the other search settings.
Public reads use the same-origin GET endpoints
`/api/search` and `/api/content`; the server selects the configured backend.
These endpoints do not forward credentials or accept a backend URL from callers.

Initial `content_search` results are projected to the fields rendered by
`BaseCard` in `server/utils/compactPageContent.ts`. The projection keeps the same
excerpt, labels, provider link and responsive image selection while omitting
full descriptions, unused audience groups, provider details and shadowed image
sources. Update the projection and its regression tests when adding card fields.
Filtered search and map responses retain their full upstream data.

## Local dependency security repair

`deepmerge` is an explicit development dependency pointing to the private fork
in `vendor/deepmerge`; the `$deepmerge` override makes the transitive Rollup
consumer use that same copy. Keeping the dependency at the root also makes
`npm ci` resolve the local directory correctly. This repairs
[GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4), for which
there is no upstream patched release as of 2026-10-28.

The fork retains the upstream MIT license and has regression tests for both the
reported prototype-poisoning cases and normal build-option merging. See
`vendor/deepmerge/README.md` for the changes. Replace the fork and override with
an upstream fixed release when one becomes available.

## Environment Variables

Add these to .env file

```bash
# A root endpoint to the API backend server
API_BASE_URL = ""
LOCAL_API_BASE_URL="" # BE staging endpooint
REST_API_USER=""
REST_API_USER_PASS=""
```

# Useless incrementor

Incremented 5 time(s)
