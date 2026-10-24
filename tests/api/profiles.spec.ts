import { test, expect } from "@playwright/test";
import { signInAs, asGuest } from "../../api/api";

test("get my profile", async ({ request }) => {
  // GIVEN: signed-in user (Cognito sign-in, token is added to every request)
  const api = await signInAs(request, {
    username: "test@example.com",
    password: "password123",
  });

  // WHEN: request own profile
  // the response is checked for 2xx and validated against GetMeSchema automatically
  const me = await api.profiles.getMe();
  console.log(JSON.stringify(me, null, 2));

  // THEN: profile is returned
  expect(me.data.id).toBeTruthy();
});

test("update profile with too long bio is rejected", async ({ request }) => {
  // GIVEN: signed-in user
  const api = await signInAs(request, {
    username: "test@example.com",
    password: "password123",
  });

  // Negative mode: the request must fail with any 4xx status,
  // the response is not validated against the success schema
  api.profiles.setTestNegative(true);

  // WHEN: bio is longer than allowed (swagger: maxLength 2048)
  const response = await api.profiles.updateMe({ bio: "a".repeat(2049) });

  // THEN: the test fails if the API accepts it (2xx);
  // the error body is printed to see what the API returned
  console.log(JSON.stringify(response, null, 2));
});

test("guest cannot get profile", async ({ request }) => {
  // GIVEN: guest — no sign-in, requests go without a token
  const api = asGuest(request);

  // Negative mode: expect any 4xx (here 401), skip schema validation
  api.profiles.setTestNegative(true);

  // WHEN: guest requests a profile that needs authorization
  const response = await api.profiles.getMe();

  // THEN: the test fails if the API returns 2xx
  console.log(JSON.stringify(response, null, 2));
});
