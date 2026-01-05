import prisma from "@/providers/database/database.provider";
import { CreateReview, UpdateReview, ReviewSchema } from "@/feature/services/review/review.schema";

export namespace ReviewRepository {
  export const getReviewsByProductId = async (productId: string) => {
    const reviews = await prisma.review.findMany({
      where: { productId },
    });
    return reviews.map((review) => ReviewSchema.parse(review));
  };

  export const getAllReviews = async () => {
    const reviews = await prisma.review.findMany();
    return reviews.map((review) => ReviewSchema.parse(review));
  };

  export const getReviewById = async (id: string) => {
    const review = await prisma.review.findUnique({
      where: { id },
    });
    return review ? ReviewSchema.parse(review) : null;
  };

  export const createReview = async (data: CreateReview) => {
    const newReview = await prisma.review.create({
      data,
    });
    return ReviewSchema.parse(newReview);
  };

  export const updateReview = async (id: string, data: UpdateReview) => {
    const updatedReview = await prisma.review.update({
      where: { id },
      data,
    });
    return ReviewSchema.parse(updatedReview);
  };

  export const deleteReview = async (id: string) => {
    const deletedReview = await prisma.review.delete({
      where: { id },
    });
    return ReviewSchema.parse(deletedReview);
  };
}