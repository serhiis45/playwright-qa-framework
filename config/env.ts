import { config } from "dotenv";
import { cleanEnv, str, url } from "envalid";

config();

export const CONFIG = cleanEnv(process.env, {
  API_BASE_URL: url({
    desc: "Base URL of the API under test",
  }),
  COGNITO_REGION: str({ default: "" }),
  COGNITO_CLIENT_ID: str({ default: "" }),
  COGNITO_POOL_ID: str({ default: "" }),
});
