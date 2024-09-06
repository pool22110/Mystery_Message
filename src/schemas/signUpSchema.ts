import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atLeast two char long")
  .max(20, "Username can't be twenty char long")
  .regex(/^[a-zA-Z0-9_]/, "Username must not contain special char");


  export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid Email add"}),
    password:z.string().min(6,"password must be atLeast 6 char")
  })
