import { z } from "zod";
const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain Special characters")
  .nonempty("Username is required.");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .regex(gmailPattern, { message: "Email must be a gmail.com address" })
    .nonempty("Email Address is required"),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 characters" })
    .nonempty("password is required"),
});
