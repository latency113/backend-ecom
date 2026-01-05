import prisma from "@/providers/database/database.provider";

export namespace AddressRepository {
  export const findManyByUserId = async (userId: string) => {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  };

  export const findUniqueById = async (id: string) => {
    return prisma.address.findUnique({
      where: { id },
    });
  };

  export const create = async (data: any) => { // Use 'any' for now to match service data types
    return prisma.address.create({ data });
  };

  export const update = async (id: string, data: any) => { // Use 'any' for now
    return prisma.address.update({
      where: { id },
      data,
    });
  };

  export const deleteById = async (id: string) => {
    return prisma.address.delete({ where: { id } });
  };

  export const updateMany = async (where: any, data: any) => { // For default address logic
    return prisma.address.updateMany({ where, data });
  };
}