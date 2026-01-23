import prisma from "@/providers/database/database.provider";
import { ProductSchema, CreateProduct, UpdateProduct } from "@/feature/services/product/product.schema";
import { Prisma } from "@prisma/client"; // Import Prisma for types

export namespace ProductRepository {
    interface PaginationParams {
        skip?: number;
        take?: number;
        searchTerm?: string;
        categoryId?: string;
    }

    interface PaginatedResult<T> {
        data: T[];
        totalCount: number;
    }

    export const getAllProducts = async (params?: PaginationParams): Promise<PaginatedResult<ProductSchema>> => {
        const { skip, take, searchTerm, categoryId } = params || {};

        const where: Prisma.ProductWhereInput = {};

        if (searchTerm) {
            where.name = {
                contains: searchTerm,
            };
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        const products = await prisma.product.findMany({
            skip,
            take,
            where,
            include: {
                images: true,
            },
        });

        const totalCount = await prisma.product.count({ where });

        return {
            data: products.map(product => ProductSchema.parse(product)),
            totalCount,
        };
    }

    export const getProductById = async (id: string) => {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
            },
        });
        return product ? ProductSchema.parse(product) : null;
    }

    export const createProduct = async (data: CreateProduct & { imgUrl?: string }) => {
        console.log("ProductRepository: createProduct received data for Prisma:", data);
        const newProduct = await prisma.product.create({
            data,
        });
        return ProductSchema.parse(newProduct);
    }

    export const updateProduct = async (id: string, data: UpdateProduct & { imgUrl?: string }) => {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data,
        });
        return ProductSchema.parse(updatedProduct);
    }

    export const deleteProduct = async (id: string) => {
        const deletedProduct = await prisma.product.delete({
            where: { id },
        });
        return ProductSchema.parse(deletedProduct);
    }

    export const getProductsByCategoryId = async (categoryId: string, params?: Omit<PaginationParams, 'where'>): Promise<PaginatedResult<ProductSchema>> => {
        const { skip, take } = params || {};
        
        const products = await prisma.product.findMany({
            skip,
            take,
            where: { categoryId },
            include: {
                images: true,
            },
        });

        const totalCount = await prisma.product.count({
            where: { categoryId },
        });

        return {
            data: products.map(product => ProductSchema.parse(product)),
            totalCount,
        };
    }
}