import { ProductRepository } from "@/feature/repositories/product/product.repository";
import { ProductSchema } from "./product.schema";
import { FileUploadService } from "@/utils/fileUpload.service";

export namespace ProductService {
  export const getAllProducts = async () => {
    const products = await ProductRepository.getAllProducts();
    return products.map((product) => ProductSchema.parse(product));
  };

  export const createProduct = async (
    data: {
      name: string;
      description?: string;
      price: number;
      stock?: number;
      categoryId: string;
    },
    imageFile?: { originalname: string; buffer: Buffer }
  ) => {
    let imgUrl: string | undefined;
    if (imageFile) {
      const relativePath = await FileUploadService.uploadImage(imageFile);
      const baseUrl = process.env.UPLOADS_BASE_URL || "http://localhost:3000"; // Use base URL from env or default
      imgUrl = `${baseUrl}${relativePath}`; // Construct absolute URL
    }
    const newProduct = await ProductRepository.createProduct({
      ...data,
      imgUrl,
    });
    return ProductSchema.parse(newProduct);
  };

  export const getProductById = async (id: string) => {
    const product = await ProductRepository.getProductById(id);
    if (!product) return null;
    return ProductSchema.parse(product);
  };

  export const updateProduct = async (
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      categoryId?: string;
    },
    imageFile?: { originalname: string; buffer: Buffer }
  ) => {
    let imgUrl: string | undefined;
    if (imageFile) {
      const relativePath = await FileUploadService.uploadImage(imageFile);
      const baseUrl = process.env.UPLOADS_BASE_URL || "http://localhost:3000"; // Use base URL from env or default
      imgUrl = `${baseUrl}${relativePath}`; // Construct absolute URL
    }
    const updatedProduct = await ProductRepository.updateProduct(id, {
      ...data,
      imgUrl,
    });
    return ProductSchema.parse(updatedProduct);
  };

  export const deleteProduct = async (id: string) => {
    const deletedProduct = await ProductRepository.deleteProduct(id);
    return ProductSchema.parse(deletedProduct);
  };
}
