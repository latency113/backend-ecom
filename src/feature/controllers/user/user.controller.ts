import { Request, Response } from "express";
import { CreateUserSchema, UpdateUserSchema } from "../../services/user/user.schema.js";
import { UserService } from "../../services/user/user.service.js";

export namespace UserController {
  export const getAllUsersHandler = async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers();
      res
        .status(200)
        .json({ message: "Users retrieved successfully", data: users });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users", error });
    }
  };
  export const createUserHandler = async (req: Request, res: Response) => {
    try {
      const parsedData = CreateUserSchema.parse(req.body);
      const user = await UserService.createUser(parsedData);
      res
        .status(201)
        .json({ message: "User created successfully", data: user });
    } catch (error) {
      res.status(400).json({ message: "Error creating user", error });
    }
  };
  export const updateUserHandler = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const parsedData = UpdateUserSchema.parse(req.body);
      const user = await UserService.updateUser(userId, parsedData);
      res
        .status(200)
        .json({ message: "User updated successfully", data: user });
    } catch (error) {
      res.status(400).json({ message: "Error updating user", error });
    }
  };
  export const deleteUserHandler = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const user = await UserService.deleteUser(userId);
      res
        .status(200)
        .json({ message: "User deleted successfully", data: user });
    } catch (error) {
      res.status(400).json({ message: "Error deleting user", error });
    }
  };
}
