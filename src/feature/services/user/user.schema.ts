import z from "zod";

export const UserSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(1).max(100),
    address: z.string().nullable().optional(),
    phone: z.string().max(10).nullable().optional(),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const UpdateUserSchema = CreateUserSchema.partial();

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;