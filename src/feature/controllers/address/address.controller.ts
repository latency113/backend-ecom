import { Request, Response } from "express";
import { AddressService } from "@/feature/services/address/address.service";
import { CreateAddressSchema, UpdateAddressSchema } from "@/feature/services/address/address.schema"; // Corrected import path
import { AuthRequest } from "@/types/auth"; // Corrected import path for AuthRequest

export namespace AddressController {
    // Get all addresses for a specific user
    export const getAddressesByUserIdHandler = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.userId; // Changed to userId
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const addresses = await AddressService.getAddressesByUserId(userId);
            res.status(200).json({ message: "Addresses retrieved successfully", data: addresses });
        } catch (error: any) {
            console.error("Error retrieving addresses:", error);
            res.status(500).json({
                message: "Error retrieving addresses",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };

    // Get a single address by ID (with user authorization)
    export const getAddressByIdHandler = async (req: AuthRequest, res: Response) => {
        try {
            const addressId = req.params.id;
            const userId = req.user?.userId; // Changed to userId
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const address = await AddressService.getAddressById(addressId);
            if (!address || address.userId !== userId) {
                return res.status(404).json({ message: "Address not found or unauthorized" });
            }
            res.status(200).json({ message: "Address retrieved successfully", data: address });
        } catch (error: any) {
            console.error("Error retrieving address:", error);
            res.status(500).json({
                message: "Error retrieving address",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };

    // Create a new address for the authenticated user
    export const createAddressHandler = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.userId; // Changed to userId
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const parsedData = CreateAddressSchema.parse({ ...req.body, userId });
            const newAddress = await AddressService.createAddress(parsedData);
            res.status(201).json({ message: "Address created successfully", data: newAddress });
        } catch (error: any) {
            console.error("Error creating address:", error);
            res.status(400).json({
                message: "Error creating address",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };

    // Update an existing address (with user authorization)
    export const updateAddressHandler = async (req: AuthRequest, res: Response) => {
        try {
            const addressId = req.params.id;
            const userId = req.user?.userId; // Changed to userId
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const parsedData = UpdateAddressSchema.parse(req.body);
            const updatedAddress = await AddressService.updateAddress(addressId, userId, parsedData);
            res.status(200).json({ message: "Address updated successfully", data: updatedAddress });
        } catch (error: any) {
            console.error("Error updating address:", error);
            res.status(400).json({
                message: "Error updating address",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };

    // Delete an address (with user authorization)
    export const deleteAddressHandler = async (req: AuthRequest, res: Response) => {
        try {
            const addressId = req.params.id;
            const userId = req.user?.userId; // Changed to userId
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const deletedAddress = await AddressService.deleteAddress(addressId, userId);
            res.status(200).json({ message: "Address deleted successfully", data: deletedAddress });
        } catch (error: any) {
            console.error("Error deleting address:", error);
            res.status(400).json({
                message: "Error deleting address",
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error
            });
        }
    };
}
