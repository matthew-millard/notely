import { z } from "zod";

export const EmailSchema = z
  .string()
  .email({ message: "Email is invalid" })
  .min(3, { message: "Email is too short" })
  .max(100, { message: "Email is too long" })
  .transform((value) => value.toLowerCase());

export const PasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(124, { message: "Password must be at most 124 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[\W_]/, {
    message: "Password must contain at least one special character",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });
