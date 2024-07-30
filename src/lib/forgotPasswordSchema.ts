import { z } from "zod";

// export const ConfirmPassSchema = z
//   .object({
//     password: z
//       .string()
//       .min(6, { message: "password must be atleast 6 characters" }),
//     confirm: z.string().min(6),
//   })
//   .superRefine(({ confirm, password }, ctx) => {
//     if (confirm !== password) {
//       ctx.addIssue({
//         code: "custom",
//         message: "The passwords did not match",
//         path: ["confirmPassword"],
//       });
//     }
//   });

const forgotPasswordSchema = z
  .object({
    pass: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain lowercase, uppercase, number, and special character"
      ),
    token: z.string().nonempty("Token is required"),
    confirmp: z
      .string()
      .min(8, "Confirmation password must be at least 8 characters long"),
  })
  .refine((data) => data.pass === data.confirmp, {
    message: "Passwords don't match",
    path: ["confirmp"],
  });

export default forgotPasswordSchema;
