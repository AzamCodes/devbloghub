import { z } from "zod";
const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
export const SendEmailForgotpassSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .regex(gmailPattern, { message: "Email must be a gmail.com address" }),
});
