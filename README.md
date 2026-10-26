# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Use Node.js 24.22.1 or a newer Node.js 24 release. Version 24.22.1 includes the
[Brotli security fix for CVE-2026-111497](https://nodejs.org/en/blog/release/v24.22.1).
The minimum version is enforced during npm installs.

```bash
nvm install
nvm use
```

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

Platform.sh uses the managed `nodejs:24` runtime. Rebuild and redeploy to receive
the provider's latest runtime patches, then verify `node --version` in the running
container reports 24.22.1 or later within Node.js 24. The build will fail if the
provider's runtime is older; contact Platform.sh support if a patched runtime is
not yet available.

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
