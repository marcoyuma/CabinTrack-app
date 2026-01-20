import z from "zod";

// export type SignupSchemaType = z.infer<typeof signupFormSchema>;

export const updateUserPasswordFormSchema = z
    .object({
        password: z.string().min(8, "Atleast 8 character is required"),
        passwordConfirm: z.string().min(8, "Atleast 8 character is required"),
    })
    .refine((val) => val.password === val.passwordConfirm, {
        error: "Paswword's dont match",
        path: ["passwordConfirm"],
    });

export type UpdateUserPasswordFormSchemaType = z.infer<
    typeof updateUserPasswordFormSchema
>;
