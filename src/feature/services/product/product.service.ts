import { ProductRepository } from "@/feature/repositories/product/product.repository";
import { ProductSchema } from "./product.schema";

export namespace ProductService {
    export const getAllProducts = async () => {
        const products = await ProductRepository.getAllProducts();
        return products.map(product => ProductSchema.parse(product));
    }

    export const getProductById = async (id: string) => {
        const product = await ProductRepository.getProductById(id);
        if (!product) return null;
        return ProductSchema.parse(product);
    }

    export const createProduct = async (data: { name: string; description?: string; price: number; stock?: number; imgUrl?: string; categoryId: string }) => {
        const newProduct = await ProductRepository.createProduct(data);
        return ProductSchema.parse(newProduct);
    }

    export const updateProduct = async (id: string, data: { name?: string; description?: string; price?: number; stock?: number; imgUrl?: string; categoryId?: string }) => {
        const updatedProduct = await ProductRepository.updateProduct(id, data);
        return ProductSchema.parse(updatedProduct);
    }

    export const deleteProduct = async (id: string) => {
        const deletedProduct = await ProductRepository.deleteProduct(id);
        return ProductSchema.parse(deletedProduct);
    }
}