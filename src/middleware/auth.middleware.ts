import { Request, Response, NextFunction } from "express";
import { AuthService } from "../feature/services/auth/auth.service";
import { AuthRequest } from "../types/auth"; // Import AuthRequest

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("AuthMiddleware: No Bearer token found.");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("AuthMiddleware: Token verification error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You do not have the necessary permissions" });
    }
    next();
  };
};
