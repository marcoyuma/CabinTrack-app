// export const signupFormSchema = z
//     .object({
//         fullName: z.string().trim().min(1, "This field is required"),
//         email: z.email().min(3, "This field is required"),
//         password: z.string().min(8, "Password atleast 8 char"),
//         passwordConfirm: z.string().min(8, "Password atleast 8 char"),
//     })
//     .refine((val) => val.password === val.passwordConfirm, {
//         error: "Password's dont match",
//         path: ["passwordConfirm"],
//     });

import z from "zod";

export const updateUserDataSchema = z.object({
    email: z.email(),
    fullName: z.string().trim().min(3, "This field is required"),
    // avatar: z.union([z.string(), z.instanceof(FileList)]).nullable(),
    avatar: z.instanceof(FileList).nullable(),
});

export type UpdateUserDataSchema = z.infer<typeof updateUserDataSchema>;
