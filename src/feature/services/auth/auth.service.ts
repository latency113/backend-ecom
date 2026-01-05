import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginInput, RegisterInput } from "./auth.schema";
import { UserRepository } from "@/feature/repositories/user/user.repository"; // Assuming this path

// This should be in an environment variable in a real application
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey"; 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export namespace AuthService {
  export const generateToken = (userId: string, email: string, role: string): string => {
    return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  };

  export const verifyToken = (token: string): { userId: string; email: string; role: string } | null => {
    try {
      console.log("AuthService.verifyToken: Verifying token with secret:", JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
      console.log("AuthService.verifyToken: Token successfully decoded:", decoded);
      return decoded;
    } catch (error) {
      console.error("AuthService.verifyToken: Token verification failed:", error);
      return null;
    }
  };

  export const register = async (input: RegisterInput) => {
    const existingUser = await UserRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser = await UserRepository.createUser({
      username: input.username,
      email: input.email,
      password: hashedPassword,
      fullName: input.fullName,
      role: "USER", // Default role
    });

    const token = generateToken(newUser.id, newUser.email, newUser.role);
    return { user: newUser, token };
  };

  export const login = async (input: LoginInput) => {
    const user = await UserRepository.findUserByEmail(input.email);
    if (!user) {
      throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }

    const token = generateToken(user.id, user.email, user.role);
    return { user, token };
  };
}