import { AddressRepository } from "@/feature/repositories/address/address.repository"; // Import the repository
import { z } from "zod"; // Import z from zod
import {
  CreateAddressSchema,
  UpdateAddressSchema,
} from "./address.schema";

export namespace AddressService {
  export const getAddressesByUserId = async (userId: string) => {
    return AddressRepository.findManyByUserId(userId);
  };

  export const getAddressById = async (id: string) => {
    return AddressRepository.findUniqueById(id);
  };

  export const createAddress = async (data: z.infer<typeof CreateAddressSchema>) => {
    // If setting a new address as default, unset default for others
    if (data.isDefault) {
      await AddressRepository.updateMany(
        { userId: data.userId, isDefault: true },
        { isDefault: false }
      );
    }
    return AddressRepository.create(data);
  };

  export const updateAddress = async (
    id: string,
    userId: string,
    data: z.infer<typeof UpdateAddressSchema>
  ) => {
    const existingAddress = await AddressRepository.findUniqueById(id);
    if (!existingAddress || existingAddress.userId !== userId) {
      throw new Error("Address not found or not authorized.");
    }

    // If setting this address as default, unset default for others
    if (data.isDefault === true) {
      await AddressRepository.updateMany(
        { userId: existingAddress.userId, isDefault: true },
        { isDefault: false }
      );
    }

    return AddressRepository.update(id, data);
  };

  export const deleteAddress = async (id: string, userId: string) => {
    const existingAddress = await AddressRepository.findUniqueById(id);
    if (!existingAddress || existingAddress.userId !== userId) {
      throw new Error("Address not found or not authorized.");
    }
    return AddressRepository.deleteById(id);
  };
}
