import { APIRequestContext } from "@playwright/test";
import { RequestHolder } from "./base/baseController";
import { CognitoController } from "./controllers/cognito/controller";
import { ProfilesController } from "./controllers/profiles/controller";

export class AppAPI extends RequestHolder {
  public profiles = new ProfilesController(this.request, this.token);
}

export async function signInAs(
  request: APIRequestContext,
  user: { username: string; password: string },
): Promise<AppAPI> {
  const { AuthenticationResult } = await new CognitoController(request).signIn(
    user,
  );

  return new AppAPI(request, AuthenticationResult.AccessToken);
}
