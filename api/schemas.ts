import { z } from "zod";

export const GetMeSchema = z.object({
  data: z.object({
    id: z.string(),
    username: z.string().nullable(),
  }),
});
