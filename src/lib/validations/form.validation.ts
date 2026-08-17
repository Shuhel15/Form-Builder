import { z } from "zod";

export const submitResponseSchema = z.object({
  answers: z.record(
    z.string(),
    z.union([z.string(), z.array(z.string())]),
  ),
});

export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;