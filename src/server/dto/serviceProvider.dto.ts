import {
  type ServiceProvider,
  type User,
  type Customer,
  type Review,
} from "@prisma/client";
import z from "zod";
import { zodErrorTypeGuard } from "~/utils/zodErrorTypeGuard";

type ServiceProviderWithReviewsAndUser = ServiceProvider & {
  user: User;
  reviews: (Review & {
    customer: Customer & {
      user: User;
    };
  })[];
};

const serviceProviderDTOSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  profileImageURL: z.string().optional(),
  profession: z.string(),
  expertise: z.array(z.string()),
  reviews: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string(),
      reviewerId: z.string(),
      reviewerName: z.string(),
      reviewerProfileImageURL: z.string().optional(),
    })
  ),
});

export type ServiceProviderDTO = z.infer<typeof serviceProviderDTOSchema>;

function validateUserProfileData(data: unknown): ServiceProviderDTO {
  try {
    const userProfile = serviceProviderDTOSchema.parse(data);
    return userProfile;
  } catch (error) {
    throw new Error(
      `Invalid service user data: ${
        zodErrorTypeGuard(error) ? error.message : "unknown error"
      }`
    );
  }
}

export function serviceProviderToDTO(
  serviceProvider: ServiceProviderWithReviewsAndUser
): ServiceProviderDTO {
  return validateUserProfileData({
    id: serviceProvider.id,
    name: serviceProvider.user.name || "Problem!",
    email: serviceProvider.user.email,
    profileImageURL: serviceProvider.user.profileImageURL,
    profession: serviceProvider.profession,
    expertise: serviceProvider.expertise,
    reviews: serviceProvider.reviews.map((review) => ({
      id: review.id,
      createdAt: review.createdAt.toISOString(),
      reviewerId: review.customerId,
      reviewerName: review.customer.user.name,
      reviewerProfileImageURL: review.customer.user.profileImageURL,
    })),
  });
}
