import { ReviewRepository } from "@/feature/repositories/review/review.repository";
import { ReviewSchema, CreateReview, UpdateReview } from "./review.schema";

export namespace ReviewService {
  export const getReviewsByProductId = async (productId: string) => {
    const reviews = await ReviewRepository.getReviewsByProductId(productId);
    return reviews.map((review) => ReviewSchema.parse(review));
  };

  export const getAllReviews = async () => {
    const reviews = await ReviewRepository.getAllReviews();
    return reviews.map((review) => ReviewSchema.parse(review));
  };

  export const getReviewById = async (id: string) => {
    const review = await ReviewRepository.getReviewById(id);
    if (!review) return null;
    return ReviewSchema.parse(review);
  };

  export const createReview = async (data: CreateReview) => {
    const newReview = await ReviewRepository.createReview(data);
    return ReviewSchema.parse(newReview);
  };

  export const updateReview = async (id: string, data: UpdateReview) => {
    const updatedReview = await ReviewRepository.updateReview(id, data);
    return ReviewSchema.parse(updatedReview);
  };

  export const deleteReview = async (id: string) => {
    const deletedReview = await ReviewRepository.deleteReview(id);
    return ReviewSchema.parse(deletedReview);
  };
}