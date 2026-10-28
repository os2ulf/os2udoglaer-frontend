# OS2udoglær frontend

Nuxt 4 frontend for OS2udoglær.

## Requirements

- Node.js 24.22.1, specified in `.nvmrc`.
- npm, using the committed `package-lock.json`.

## Local setup

Select the project Node.js version and install dependencies:

```bash
nvm install
nvm use
npm ci
```

Installation runs `nuxt prepare` to generate Nuxt types and the ESLint configuration.
Keep the `vendor/` directory in the checkout; it contains a local build dependency.

Create a `.env` file in the project root and set the backend URLs:

```dotenv
LOCAL_API_BASE_URL=""
API_BASE_URL=""
REST_API_USER=""
REST_API_USER_PASS=""
```

- `LOCAL_API_BASE_URL`: backend root URL used when running on localhost.
- `API_BASE_URL`: backend root URL used by article-form requests.
- `REST_API_USER` and `REST_API_USER_PASS`: server-side credentials for application submissions, when needed.

The `.env` file is ignored by Git. Use the backend URLs and credentials for your environment.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To use production content locally without editing `.env`:

```bash
NUXT_PUBLIC_LOCAL_API_BASE_URL=https://api.ulfiaarhus.dk npm run dev
```

Search pages available for local checks include `/grundskole-0` and `/udbydere`.

## Checks

```bash
npm run eslint
npm run stylelint
npm run typecheck
npm test
```

ESLint and Stylelint fail on warnings. To apply automatic fixes:

```bash
npm run eslint:fix
npm run stylelint:fix
```

`npm run typecheck` regenerates Nuxt types and checks TypeScript files with the
native compiler. It does not check Vue templates. The compatibility compiler
can check the same files with `npx tsc6 --noEmit`.

Vue tooling uses the TypeScript compatibility package. Editors requiring a
workspace `tsserver` should use `node_modules/@typescript/old/lib` as the SDK path.

## Production build and local preview

```bash
npm run build
npm run preview
```

To start the built server directly:

```bash
npm start
```

Production runtime configuration can be supplied through `NUXT_PUBLIC_LOCAL_API_BASE_URL`,
`NUXT_PUBLIC_API_BASE_URL`, `NUXT_REST_API_USER`, and `NUXT_REST_API_USER_PASS`.
Hosted environments select the backend using `PLATFORM_ROUTES`.

See the [Nuxt documentation](https://nuxt.com/docs/4.x/getting-started/introduction)
for framework configuration and deployment guidance.
