# Application form regression simulation

Created 2026-10-28 from the frontend handler's existing request paths and response
envelopes. The mock is a local fixture, not a production Drupal implementation.

## Purpose

Run the actual form and sitemap handlers against
`postman/mocks/application-backend/default.cjs`. The assertions live in
`check.mjs` beside this document.

## Execution

Use Node 24 and a separate copy of the project without `.env`, `.nuxt`, or
`.output`, with installed dependencies. This avoids the active development
server's build directory and keeps the test configuration local.

```sh
postman simulation run postman/simulations/application-form/application-form.sim.yaml --port 4900 --output ndjson --no-history
```

In that copy, start the app in a second terminal:

```sh
export LOCAL_API_BASE_URL=http://localhost:4900/backend
export API_BASE_URL=$LOCAL_API_BASE_URL
export NUXT_PUBLIC_LOCAL_API_BASE_URL=$LOCAL_API_BASE_URL
export NUXT_PUBLIC_API_BASE_URL=$LOCAL_API_BASE_URL
export REST_API_USER=fixture-user REST_API_USER_PASS=fixture-pass
export NUXT_REST_API_USER=fixture-user NUXT_REST_API_USER_PASS=fixture-pass
export PLATFORM_ROUTES=eyJodHRwOi8vbG9jYWxob3N0OjQ5MDAvYmFja2VuZC8iOnsidXBzdHJlYW0iOiJiYWNrZW5kIn19
npm run dev -- --port 3100 --host 127.0.0.1 --strictPort --no-tui --no-fork
```

After both servers are listening, run `node postman/simulations/application-form/check.mjs`.
Set `POSTMAN_CLI` if the executable is not on PATH. The check prints its report
directory. Stop both servers with Ctrl-C after inspecting the simulation's
request events.

## Assumptions

- The fixture checks HTTP transport, origin rejection, JSON error handling, and
  XML cleanup; it does not prove Drupal entity validation or production
  credentials. No owning workspace mock was used for this local regression
  fixture. (reasoned 2026-10-28 from the frontend handlers)
- The existing API reports submission status in its JSON envelope while the HTTP
  response remains 200. The checks preserve that contract. (observed 2026-10-28)

## Observations

<!-- begin:observations -->
2026-10-28: all six checks passed. The backend member served accepted submissions,
the malformed JSON response, and both sitemap paths. Requests with missing or
mismatched origins did not reach it.
<!-- end:observations -->

## What didn't work

- 2026-10-28: the CLI parsed an `Origin:http://localhost:3100` header argument as
  `Origin: http`, so the frontend correctly returned its forbidden envelope.
  `check.mjs` sets this header through a pre-request script to retain the URL.
