import { Request, Response } from "express";
import { ReviewService } from "@/feature/services/review/review.service";
import { CreateReviewSchema, UpdateReviewSchema } from "@/feature/services/review/review.schema";

export namespace ReviewController {
    export const getReviewsByProductIdHandler = async (req: Request, res: Response) => {
        try {
            const productId = req.params.productId;
            const reviews = await ReviewService.getReviewsByProductId(productId);
            res.status(200).json({ message: "Reviews retrieved successfully", data: reviews });
        } catch (error: any) {
            console.error("Error retrieving product reviews:", error);
            res.status(500).json({ 
                message: "Error retrieving product reviews", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const getAllReviewsHandler = async (req: Request, res: Response) => {
        try {
            const reviews = await ReviewService.getAllReviews();
            res.status(200).json({ message: "Reviews retrieved successfully", data: reviews });
        } catch (error: any) {
            console.error("Error retrieving reviews:", error);
            res.status(500).json({ 
                message: "Error retrieving reviews", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const getReviewByIdHandler = async (req: Request, res: Response) => {
        try {
            const reviewId = req.params.id;
            const review = await ReviewService.getReviewById(reviewId);
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.status(200).json({ message: "Review retrieved successfully", data: review });
        } catch (error: any) {
            console.error("Error retrieving review:", error);
            res.status(500).json({ 
                message: "Error retrieving review", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const createReviewHandler = async (req: Request, res: Response) => {
        try {
            const parsedData = CreateReviewSchema.parse(req.body);
            const newReview = await ReviewService.createReview(parsedData);
            res.status(201).json({ message: "Review created successfully", data: newReview });
        } catch (error: any) {
            console.error("Error creating review:", error);
            res.status(400).json({ 
                message: "Error creating review", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const updateReviewHandler = async (req: Request, res: Response) => {
        try {
            const reviewId = req.params.id;
            const parsedData = UpdateReviewSchema.parse(req.body);
            const updatedReview = await ReviewService.updateReview(reviewId, parsedData);
            res.status(200).json({ message: "Review updated successfully", data: updatedReview });
        } catch (error: any) {
            console.error("Error updating review:", error);
            res.status(400).json({ 
                message: "Error updating review", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };

    export const deleteReviewHandler = async (req: Request, res: Response) => {
        try {
            const reviewId = req.params.id;
            const deletedReview = await ReviewService.deleteReview(reviewId);
            res.status(200).json({ message: "Review deleted successfully", data: deletedReview });
        } catch (error: any) {
            console.error("Error deleting review:", error);
            res.status(400).json({ 
                message: "Error deleting review", 
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
            });
        }
    };
}