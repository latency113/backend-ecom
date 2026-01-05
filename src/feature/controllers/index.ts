import { Express, Request, Response } from "express";
import { UserController } from "./user/user.controller";
import { CategoryController } from "./category/category.controller";
import { ProductController } from "./product/product.controller";
import { CartController } from "./cart/cart.controller";
import { CartItemController } from "./cartItem/cartItem.controller";
import { OrderController } from "./order/order.controller";
import { OrderItemController } from "./orderItem/orderItem.controller";
import { ReviewController } from "./review/review.controller";
import { AuthController } from "./auth/auth.controller";
import { uploadControllers } from "./upload/upload.controller";
import { AddressController } from "./address/address.controller"; // Import AddressController
import { adminDashboardControllers } from "./adminDashboard"; // Import adminDashboardControllers
import multer from "multer"; // Import multer locally
import { authMiddleware, authorizeRoles } from "@/middleware/auth.middleware";

const productUpload = multer({ storage: multer.memoryStorage() }); // Define local multer instance


export const userControllers = (app: Express) => {
  app.get("/api/v1/users", authMiddleware, authorizeRoles('ADMIN'), UserController.getAllUsersHandler);
  app.get("/api/v1/users/:id", authMiddleware, UserController.getUserByIdHandler);
  app.post("/api/v1/users", authMiddleware, authorizeRoles('ADMIN'), UserController.createUserHandler);
  app.put("/api/v1/users/:id", authMiddleware, UserController.updateUserHandler);
  app.delete("/api/v1/users/:id", authMiddleware, authorizeRoles('ADMIN'), UserController.deleteUserHandler);
};

export const categoryControllers = (app: Express) => {
  app.get("/api/v1/categories", CategoryController.getAllCategoriesHandler);
  app.get("/api/v1/categories/:id", CategoryController.getCategoryByIdHandler);
  app.get("/api/v1/categories/:id/products", ProductController.getProductsByCategoryIdHandler);
  app.post("/api/v1/categories", authMiddleware, authorizeRoles('ADMIN'), CategoryController.createCategoryHandler);
  app.put("/api/v1/categories/:id", authMiddleware, authorizeRoles('ADMIN'), CategoryController.updateCategoryHandler);
  app.delete("/api/v1/categories/:id", authMiddleware, authorizeRoles('ADMIN'), CategoryController.deleteCategoryHandler);
};

export const productController = (app: Express) => {
  app.get("/api/v1/products", ProductController.getAllProductsHandler);
  app.get("/api/v1/products/:id", ProductController.getProductByIdHandler);
  app.post(
    "/api/v1/products",
    authMiddleware,
    authorizeRoles('ADMIN'),
    productUpload.single("image"), // Use the local multer instance
    ProductController.createProductHandler
  );
  app.put(
    "/api/v1/products/:id",
    authMiddleware,
    authorizeRoles('ADMIN'),
    productUpload.single("image"), // Use the local multer instance
    ProductController.updateProductHandler
  );
  app.delete("/api/v1/products/:id", authMiddleware, authorizeRoles('ADMIN'), ProductController.deleteProductHandler);
};

export const cartControllers = (app: Express) => {
  app.get("/api/v1/carts", authMiddleware, CartController.getAllCartsHandler);
  app.get("/api/v1/carts/:id", authMiddleware, CartController.getCartByIdHandler);
  app.post("/api/v1/carts", authMiddleware, CartController.createCartHandler);
  app.put("/api/v1/carts/:id", authMiddleware, CartController.updateCartHandler);
  app.delete("/api/v1/carts/:id", authMiddleware, CartController.deleteCartHandler);
  app.delete("/api/v1/carts/:id/items", authMiddleware, CartController.clearCartHandler); // New: Clear cart items
  app.get("/api/v1/carts/user/:id", authMiddleware, CartController.getCartByUserIdHandler);
};

export const cartItemControllers = (app: Express) => {
  app.get("/api/v1/cartItems", authMiddleware, CartItemController.getAllCartItemsHandler);
  app.get("/api/v1/cartItems/:id", authMiddleware, CartItemController.getCartItemByIdHandler);
  app.post("/api/v1/cartItems", authMiddleware, CartItemController.createCartItemHandler);
  app.put("/api/v1/cartItems/:id", authMiddleware, CartItemController.updateCartItemHandler);
  app.delete("/api/v1/cartItems/:id", authMiddleware, CartItemController.deleteCartItemHandler);
};

export const orderControllers = (app: Express) => {
  app.get("/api/v1/orders", authMiddleware, authorizeRoles('ADMIN', 'USER'), OrderController.getAllOrdersHandler);
  app.get("/api/v1/orders/user/:id", authMiddleware, OrderController.getOrdersByUserIdHandler); // New: Get orders by user ID
  app.get("/api/v1/orders/:id", authMiddleware, OrderController.getOrderByIdHandler);
  app.post("/api/v1/orders", authMiddleware, OrderController.createOrderHandler);
  app.put("/api/v1/orders/:id", authMiddleware, authorizeRoles('ADMIN'), OrderController.updateOrderHandler);
  app.put("/api/v1/orders/:id/status", authMiddleware, authorizeRoles('ADMIN'), OrderController.updateOrderStatusHandler); // New: Update order status
  app.patch("/api/v1/orders/:id", authMiddleware, OrderController.cancelOrderHandler); // New: Cancel order
  app.delete("/api/v1/orders/:id", authMiddleware, authorizeRoles('ADMIN'), OrderController.deleteOrderHandler);
};

export const orderItemControllers = (app: Express) => {
  app.get("/api/v1/orderItems", authMiddleware, OrderItemController.getAllOrderItemsHandler);
  app.get("/api/v1/orderItems/:id", authMiddleware, OrderItemController.getOrderItemByIdHandler);
  app.post("/api/v1/orderItems", authMiddleware, OrderItemController.createOrderItemHandler);
  app.put("/api/v1/orderItems/:id", authMiddleware, OrderItemController.updateOrderItemHandler);
  app.delete("/api/v1/orderItems/:id", authMiddleware, OrderItemController.deleteOrderItemHandler);
};

export const reviewControllers = (app: Express) => {
  app.get("/api/v1/reviews", ReviewController.getAllReviewsHandler);
  app.get("/api/v1/reviews/:id", ReviewController.getReviewByIdHandler);
  app.get("/api/v1/products/:productId/reviews", ReviewController.getReviewsByProductIdHandler);
  app.post("/api/v1/reviews", authMiddleware, ReviewController.createReviewHandler);
  app.put("/api/v1/reviews/:id", authMiddleware, ReviewController.updateReviewHandler);
  app.delete("/api/v1/reviews/:id", authMiddleware, ReviewController.deleteReviewHandler);
};

export const authControllers = (app: Express) => {
  app.post("/api/v1/register", AuthController.registerHandler);
  app.post("/api/v1/login", AuthController.loginHandler);
};

export const addressControllers = (app: Express) => {
  app.get("/api/v1/addresses", authMiddleware, AddressController.getAddressesByUserIdHandler);
  app.get("/api/v1/addresses/:id", authMiddleware, AddressController.getAddressByIdHandler); // Get single address by ID
  app.post("/api/v1/addresses", authMiddleware, AddressController.createAddressHandler);
  app.put("/api/v1/addresses/:id", authMiddleware, AddressController.updateAddressHandler);
  app.delete("/api/v1/addresses/:id", authMiddleware, AddressController.deleteAddressHandler);
};

export {
  uploadControllers,
  adminDashboardControllers // Export adminDashboardControllers
}


