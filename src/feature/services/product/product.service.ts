import { ProductRepository } from "@/feature/repositories/product/product.repository";
import { ProductSchema, CreateProduct, UpdateProduct } from "./product.schema"; // Import CreateProduct and UpdateProduct
import { FileUploadService } from "@/utils/fileUpload.service";
import prisma from "@/providers/database/database.provider";

export namespace ProductService {
  interface PaginationOptions {
    page?: number;
    limit?: number;
    searchTerm?: string;
    categoryId?: string;
  }

  interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }

  export const getAllProducts = async (options?: PaginationOptions): Promise<PaginatedResponse<ProductSchema>> => {
    const page = options?.page ? Math.max(1, options.page) : 1;
    const limit = options?.limit ? Math.max(1, options.limit) : 10;
    const searchTerm = options?.searchTerm;
    const categoryId = options?.categoryId;
    const skip = (page - 1) * limit;

    const { data, totalCount } = await ProductRepository.getAllProducts({ skip, take: limit, searchTerm, categoryId });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      totalCount,
      currentPage: page,
      totalPages,
    };
  };

  export const createProduct = async (
    data: CreateProduct, // Use CreateProduct type
    imageFile?: { originalname: string; buffer: Buffer },
    galleryFiles?: { originalname: string; buffer: Buffer }[]
  ) => {
    let imgUrl: string | undefined;
    if (imageFile) {
      const relativePath = await FileUploadService.uploadImage(imageFile);
      const baseUrl = process.env.UPLOADS_BASE_URL; // Use UPLOADS_BASE_URL from env
      if (!baseUrl) {
        throw new Error("UPLOADS_BASE_URL environment variable is not set.");
      }
      imgUrl = `${baseUrl}${relativePath}`; // Construct absolute URL
    }

    const galleryUrls: string[] = [];
    if (galleryFiles && galleryFiles.length > 0) {
      const baseUrl = process.env.UPLOADS_BASE_URL;
      if (!baseUrl) throw new Error("UPLOADS_BASE_URL is not set.");
      
      for (const file of galleryFiles) {
        const relativePath = await FileUploadService.uploadImage(file);
        galleryUrls.push(`${baseUrl}${relativePath}`);
      }
    }

    const newProduct = await ProductRepository.createProduct({
      ...data,
      imgUrl,
    });

    if (galleryUrls.length > 0) {
      // Create ProductImage entries
      await Promise.all(galleryUrls.map(url => prisma.productImage.create({
        data: {
          url,
          productId: newProduct.id
        }
      })));
    }

    return getProductById(newProduct.id);
  };

  export const getProductById = async (id: string) => {
    const product = await ProductRepository.getProductById(id);
    if (!product) return null;
    return product; // Already parsed by repo
  };

  export const updateProduct = async (
    id: string,
    data: UpdateProduct, // Use UpdateProduct type
    imageFile?: { originalname: string; buffer: Buffer },
    galleryFiles?: { originalname: string; buffer: Buffer }[]
  ) => {
    let imgUrl: string | undefined;
    if (imageFile) {
      const relativePath = await FileUploadService.uploadImage(imageFile);
      const baseUrl = process.env.UPLOADS_BASE_URL; // Use UPLOADS_BASE_URL from env
      if (!baseUrl) {
        throw new Error("UPLOADS_BASE_URL environment variable is not set.");
      }
      imgUrl = `${baseUrl}${relativePath}`; // Construct absolute URL
    }

    const galleryUrls: string[] = [];
    if (galleryFiles && galleryFiles.length > 0) {
      const baseUrl = process.env.UPLOADS_BASE_URL;
      if (!baseUrl) throw new Error("UPLOADS_BASE_URL is not set.");
      
      for (const file of galleryFiles) {
        const relativePath = await FileUploadService.uploadImage(file);
        galleryUrls.push(`${baseUrl}${relativePath}`);
      }
    }

    const updatedProduct = await ProductRepository.updateProduct(id, {
      ...data,
      imgUrl,
    });

    if (galleryUrls.length > 0) {
       // Optional: clear existing or just add? Usually we might want to replace or just add.
       // For simplicity, let's just add for now.
       await Promise.all(galleryUrls.map(url => prisma.productImage.create({
        data: {
          url,
          productId: updatedProduct.id
        }
      })));
    }

    return getProductById(updatedProduct.id);
  };

  export const deleteProduct = async (id: string) => {
    const deletedProduct = await ProductRepository.deleteProduct(id);
    return ProductSchema.parse(deletedProduct);
  };

  export const getProductsByCategoryId = async (categoryId: string, options?: PaginationOptions): Promise<PaginatedResponse<ProductSchema>> => {
    const page = options?.page ? Math.max(1, options.page) : 1;
    const limit = options?.limit ? Math.max(1, options.limit) : 10;
    const skip = (page - 1) * limit;

    const { data, totalCount } = await ProductRepository.getProductsByCategoryId(categoryId, { skip, take: limit });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      totalCount,
      currentPage: page,
      totalPages,
    };
  };
}
