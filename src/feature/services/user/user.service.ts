import { UserRepository } from "@/feature/repositories/user/user.repository";
import { UserSchema } from "./user.schema";
import bcrypt from "bcrypt";

export namespace UserService {
    export const getAllUsers = async () => {
        const users = await UserRepository.getAllUsers();
        return users.map(user => UserSchema.parse(user));
    }

    export const getUserById = async (id: string) => {
        const user = await UserRepository.getUserById(id);
        if (!user) return null;
        return UserSchema.parse(user);
    }

    export const createUser = async (data: { username: string; email: string; password: string; fullName: string }) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await UserRepository.createUser({ ...data, password: hashedPassword });
        return UserSchema.parse(newUser);
    }

    export const updateUser = async (id: string, data: { username?: string; email?: string; password?: string; fullName?: string }) => {
        const updatedUser = await UserRepository.updateUser(id, data);
        return UserSchema.parse(updatedUser);
    }

    export const deleteUser = async (id: string) => {
        const deletedUser = await UserRepository.deleteUser(id);
        return UserSchema.parse(deletedUser);
    }
}