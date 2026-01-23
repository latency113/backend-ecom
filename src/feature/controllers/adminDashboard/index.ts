import { Express, Request, Response } from "express";
import { getDashboardStats, getRevenueReport } from "../../services/adminDashboard.service";
import { authMiddleware, authorizeRoles } from "../../../middleware/auth.middleware"; // Import middleware

export const adminDashboardControllers = (app: Express) => {
  app.get(
    "/api/v1/admin/dashboard/stats",
    authMiddleware,
    authorizeRoles("ADMIN"),
    async (req: Request, res: Response) => {
      try {
        const stats = await getDashboardStats();
        res.status(200).json({ success: true, data: stats });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );

  app.get(
    "/api/v1/admin/dashboard/revenue",
    authMiddleware,
    authorizeRoles("ADMIN"),
    async (req: Request, res: Response) => {
      try {
        const report = await getRevenueReport();
        res.status(200).json({ success: true, data: report });
      } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  );
};