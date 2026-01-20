import z from "zod";

export const signupFormSchema = z
    .object({
        fullName: z.string().trim().min(1, "This field is required"),
        email: z.email().min(3, "This field is required"),
        password: z.string().min(8, "Password atleast 8 char"),
        passwordConfirm: z.string().min(8, "Password atleast 8 char"),
    })
    .refine((val) => val.password === val.passwordConfirm, {
        error: "Password's dont match",
        path: ["passwordConfirm"],
    });

export type SignupFormSchema = z.infer<typeof signupFormSchema>;
