import { Express, Request, Response } from "express";
import { UserController } from "./user/user.controller";
import { CategoryController } from "./category/category.controller";
import { ProductController } from "./product/product.controller";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export const userControllers = (app: Express) => {
  app.get("/users", UserController.getAllUsersHandler);
  app.get("/users/:id", UserController.getAllUsersHandler);
  app.post("/users", UserController.createUserHandler);
  app.put("/users/:id", UserController.updateUserHandler);
  app.delete("/users/:id", UserController.deleteUserHandler);
}

export const categoryControllers = (app: Express) => {
  app.get("/categories", CategoryController.getAllCategoriesHandler);
  app.get("/categories/:id", CategoryController.getCategoryByIdHandler);
  app.post("/categories", CategoryController.createCategoryHandler);
  app.put("/categories/:id", CategoryController.updateCategoryHandler);
  app.delete("/categories/:id", CategoryController.deleteCategoryHandler);
}

export const productController =  (app: Express) => {
  app.get("/products", ProductController.getAllProductsHandler);
  app.get("/products/:id", ProductController.getProductByIdHandler);
  app.post("/products", upload.single('image'), ProductController.createProductHandler);
  app.put("/products/:id", ProductController.updateProductHandler);
  app.delete("/products/:id", ProductController.deleteProductHandler);
}