# Playwright QA Framework

API testing on Playwright + zod, for both manual requests and automated tests.
Every request goes through a typed controller method, and every response is
validated against a zod schema. Think Postman, but requests are code: easy to
add with an LLM and reusable as autotests.

## Setup

```bash
git clone https://github.com/serhiis45/playwright-qa-framework.git
cd playwright-qa-framework
npm install
cp .env.example .env
```

Fill in `.env`:

- `API_BASE_URL`: base URL of the API, without a trailing slash
- `COGNITO_*`: only if the API uses AWS Cognito sign-in

## Running

All tests:

```bash
npm run test:api
```

One test: mark it with `test.only`, or run it from VS Code with the
[Playwright Test](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
extension (green ▶ next to the test).

Reports: `npx playwright show-report`. Failed tests keep a trace with every
request and response.

## Request example

```ts
import { test, expect } from "@playwright/test";
import { signInAs } from "../../api/api";

test("get my profile", async ({ request }) => {
  const api = await signInAs(request, { username: "...", password: "..." });
  const me = await api.profiles.getMe();
  expect(me.data.id).toBeTruthy();
});
```

## Negative test example

```ts
test("update profile with too long bio is rejected", async ({ request }) => {
  const api = await signInAs(request, { username: "...", password: "..." });
  api.profiles.setTestNegative(true);

  const response = await api.profiles.updateMe({ bio: "a".repeat(2049) });
  console.log(JSON.stringify(response, null, 2));
});
```

`setTestNegative(true)` makes the controller expect any 4xx and return the error
body instead of validating the success schema.

## Adding endpoints

See [CLAUDE.md](CLAUDE.md): it describes the structure and the steps (schema →
controller method → registration in `AppAPI`). With Claude Code, it is enough to
say "add a method for `GET /...` from swagger".

## Structure

```
config/env.ts              env variables
api/base/                  BaseController (request, status check, schema validation)
api/controllers/           controllers, one per API area
api/controllers/cognito/   Cognito sign-in
api/schemas.ts             response schemas
api/api.ts                 AppAPI (all controllers) and signInAs()
tests/api/                 tests and manual requests
```
