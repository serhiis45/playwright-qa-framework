import { test, expect } from "@playwright/test";
import { signInAs } from "../../api/api";

test("get my profile", async ({ request }) => {
  const api = await signInAs(request, {
    username: "test@example.com",
    password: "password123",
  });

  const me = await api.profiles.getMe();
  console.log(JSON.stringify(me, null, 2));

  expect(me.data.id).toBeTruthy();
});
