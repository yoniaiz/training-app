import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { zodErrorTypeGuard } from "~/utils/zodErrorTypeGuard";

type CustomerWithUser = Prisma.CustomerGetPayload<{
  include: {
    user: true;
  };
}>;

const customerDTOSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  profileImageURL: z.string().optional(),
  interests: z.array(z.string()),
  servicesSeeked: z.array(z.string()),
});

export type CustomerDTO = z.infer<typeof customerDTOSchema>;

function validateCustomerData(data: unknown): CustomerDTO {
  try {
    const customer = customerDTOSchema.parse(data);
    return customer;
  } catch (error) {
    throw new Error(
      `Invalid customer data: ${
        zodErrorTypeGuard(error) ? error.message : "unknown error"
      }`
    );
  }
}

export function customerToDTO(customer: CustomerWithUser): CustomerDTO {
  return validateCustomerData({
    id: customer.id,
    name: customer.user.name || "Problem!",
    email: customer.user.email,
    profileImageURL: customer.user.profileImageURL,
    interests: customer.interests,
    servicesSeeked: customer.servicesSeeked,
  });
}
