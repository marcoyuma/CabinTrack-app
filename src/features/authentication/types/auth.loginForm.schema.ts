import z from "zod";

// Login only checks that the fields are filled in — password strength is the signup
// form's concern (see auth.signupForm.schema.ts). Enforcing min(8) here would lock out
// any account created before that rule existed.
export const loginFormSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "This field is required"),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
