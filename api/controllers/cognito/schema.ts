import { z } from "zod";

export const CognitoSignInSchema = z.object({
  AuthenticationResult: z.object({
    AccessToken: z.string(),
    IdToken: z.string(),
    RefreshToken: z.string(),
    ExpiresIn: z.number(),
    TokenType: z.string(),
  }),
});
