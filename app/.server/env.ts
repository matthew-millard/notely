import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export type EnvVariables = z.infer<typeof envSchema>;
export const ENV = env;
