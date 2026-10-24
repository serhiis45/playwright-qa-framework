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

## Endpoint without a schema

If swagger schemas are unreliable and the goal is only to call endpoints and
look at responses, use `z.unknown()`:

```ts
public async getMe() {
  return this.send({
    method: "GET",
    url: `${this.BASE_PATH}/me`,
    schema: z.unknown(), // no response validation
  });
}
```

Status is still checked. The response is not validated and has no field types.
Add a real schema later when the endpoint becomes an autotest.

## Writing a test or a manual request

```ts
import { test, expect } from "@playwright/test";
import { signInAs } from "../../api/api";

test("get my profile", async ({ request }) => {
  const api = await signInAs(request, { username: "...", password: "..." });
  const me = await api.profiles.getMe();
  expect(me.data.id).toBeTruthy();
});
```

Negative test: enable negative mode on the controller, then call the same
method.

```ts
api.profiles.setTestNegative(true);
const response = await api.profiles.updateMe({ bio: "a".repeat(2049) });
```

- In negative mode the request must return any 4xx; the success schema is not
  validated, and the error body is returned.
- Exact status: pass `expectedStatus` to `send()` in the controller method (e.g.
  `400`).

## Rules

- Schemas follow swagger. If the real response differs, report the mismatch to
  the user before loosening the schema; never silently adapt the schema to the
  response.
- Test expectations come from requirements, not from backend behaviour.
- Never read `.env`. Use `.env.example` to learn variable names.
- Never commit real credentials, tokens or project API docs (`swagger.json` is
  gitignored).
- `API_BASE_URL` has no trailing slash; controller paths start with `/`.
