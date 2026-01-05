import { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "../../services/auth/auth.schema";
import { AuthService } from "../../services/auth/auth.service";
import { fromZodError } from "zod-validation-error";

export namespace AuthController {
  export const registerHandler = async (req: Request, res: Response) => {
    try {
      const input = RegisterSchema.parse(req.body);
      const { user, token } = await AuthService.register(input);
      res.status(201).json({ message: "User registered successfully", user, token });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(400).json({ message: error.message });
    }
  };

  export const loginHandler = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse(req.body);
      const { user, token } = await AuthService.login(input);
      res.status(200).json({ message: "Logged in successfully", user, token });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(400).json({ message: error.message });
    }
  };
}