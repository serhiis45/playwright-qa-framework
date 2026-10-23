# Playwright QA Framework

API testing framework (manual and automated) on Playwright + zod. Requests go
through typed controller methods; every response is validated against a zod
schema.

## Structure

- `config/env.ts` — env variables (validated with envalid). Template:
  `.env.example`.
- `api/base/baseController.ts` — `BaseController`: `send()` makes the request,
  checks the status and validates the schema.
- `api/controllers/<name>/controller.ts` — one controller per API area.
- `api/controllers/cognito/` — Cognito sign-in (`USER_PASSWORD_AUTH`).
- `api/schemas.ts` — all response schemas of the project API (Cognito schema
  stays in its own folder).
- `api/api.ts` — `AppAPI` (registry of all controllers) and `signInAs()`.
- `tests/api/` — tests and manual requests.

## Adding an endpoint

1. Add the response schema to `api/schemas.ts`, strictly from swagger.
2. Add a method to the controller (create the controller if needed):

```ts
public async getMe() {
  return this.send({
    method: "GET",
    url: `${this.BASE_PATH}/me`,
    schema: GetMeSchema,
  });
}
```

- query params, body, files: `options: { params, data, multipart }`
- the return type comes from the schema, no separate `export type` needed

3. New controller: register it in `AppAPI` in `api/api.ts` (one line).

## Writing a test or a manual request

```ts
import { test, expect } from "@playwright/test";
import { signInAs } from "../../api/api";
```
