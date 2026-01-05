import { Express, Request, Response } from "express";
import { FileUploadService } from "../../../utils/fileUpload.service";
import multer from "multer";

export const upload = multer({ storage: multer.memoryStorage() });

export class UploadController {
  static async postUploadHandler(req: Request, res: Response) {
    try {
      console.log("Backend upload.controller.ts: Received file:", req.file);
      if (!req.file) {
        console.log("Backend upload.controller.ts: No file uploaded.");
        return res.status(400).json({ message: "No file uploaded." });
      }

      const file = {
        originalname: req.file.originalname,
        buffer: req.file.buffer,
      };

      const imgUrl = await FileUploadService.uploadImage(file);
      console.log("Backend upload.controller.ts: imgUrl from FileUploadService:", imgUrl);
      res.status(200).json({ imageUrl: imgUrl });
      console.log("Backend upload.controller.ts: Sent response:", { imageUrl: imgUrl });
    } catch (error: any) {
      console.error("Backend upload.controller.ts: Error uploading image:", error);
      res.status(500).json({ message: error.message || "Failed to upload image." });
    }
  }
}

export const uploadControllers = (app: Express) => {
  app.post("/api/v1/upload", upload.single("imgUrl"), UploadController.postUploadHandler);
};
