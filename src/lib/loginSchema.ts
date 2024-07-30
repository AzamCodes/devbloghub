import { z } from "zod";
const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .regex(gmailPattern, { message: "Email must be a gmail.com address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
