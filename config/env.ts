import { config } from "dotenv";
import { cleanEnv, url } from "envalid";

config();

const env = cleanEnv(process.env, {
  API_BASE_URL: url({
    desc: "Base URL of the API under test",
  }),
});

export const CONFIG = {
  API_BASE_URL: env.API_BASE_URL.replace(/\/+$/, ""),
};
