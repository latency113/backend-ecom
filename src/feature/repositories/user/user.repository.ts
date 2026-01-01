import prisma from "@/providers/database/database.provider";

export namespace UserRepository {
  export const getAllUsers = async () => {
    return await prisma.user.findMany();
  };

  export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  };

  export const createUser = async (data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  }) => {
    return await prisma.user.create({
      data,
    });
  };

  export const updateUser = async (
    id: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      fullName?: string;
    }
  ) => {
    return await prisma.user.update({
      where: { id },
      data,
    });
  };

  export const deleteUser = async (id: string) => {
    return await prisma.user.delete({
      where: { id },
    });
  };
}
