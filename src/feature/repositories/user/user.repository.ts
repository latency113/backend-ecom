import prisma from "@/providers/database/database.provider";
import { UserSchema, CreateUserInput, UpdateUserInput } from "@/feature/services/user/user.schema";

export namespace UserRepository {
  export const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users.map(user => UserSchema.parse(user));
  };

  export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? UserSchema.parse(user) : null;
  };

  export const createUser = async (data: CreateUserInput) => {
    const newUser = await prisma.user.create({
      data,
    });
    return UserSchema.parse(newUser);
  };

  export const updateUser = async (
    id: string,
    data: UpdateUserInput
  ) => {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    return UserSchema.parse(updatedUser);
  };

  export const deleteUser = async (id: string) => {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return UserSchema.parse(deletedUser);
  };
  export const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user ? UserSchema.parse(user) : null;
  };
}
