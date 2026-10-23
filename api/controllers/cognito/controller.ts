import { BaseController } from "../../base/baseController";
import { CONFIG } from "../../../config/env";
import { CognitoSignInSchema } from "./schema";

const { COGNITO_REGION, COGNITO_POOL_ID, COGNITO_CLIENT_ID } = CONFIG;

export class CognitoController extends BaseController {
  public isTestNegative = false;
  protected headers = {
    "Content-Type": "application/x-amz-json-1.1",
  };

  private BASE_PATH = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_POOL_ID}`;

  public async signIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    return this.send({
      method: "POST",
      url: this.BASE_PATH,
      schema: CognitoSignInSchema,
      options: {
        headers: {
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        },
        data: {
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: COGNITO_CLIENT_ID,
          AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
          },
        },
      },
    });
  }
}
