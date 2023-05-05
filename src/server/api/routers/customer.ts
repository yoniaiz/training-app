import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Expertise, Professions } from "@prisma/client";

const EXPERTISE: [Expertise, ...Expertise[]] = [
  Expertise.ARMY_PREPARATION,
  ...Object.values(Expertise),
];

const PROFESSIONS: [Professions, ...Professions[]] = [
  Professions.NUTRITIONIST,
  ...Object.values(Professions),
];

export const customerRouter = createTRPCRouter({
  get: privateProcedure.query(async ({ ctx }) => {
    const customer = await ctx.prisma.customer.findUnique({
      where: {
        userId: ctx.userId,
      },
    });

    return customer;
  }),
  add: privateProcedure
    .input(
      z.object({
        servicesSeeked: z.array(z.enum(PROFESSIONS)),
        interests: z.array(z.enum(EXPERTISE)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { interests, servicesSeeked } = input;
      const createdCustomer = await ctx.prisma.customer.create({
        data: {
          interests,
          servicesSeeked,
          user: {
            connect: {
              id: ctx.userId,
            },
          },
        },
      });

      return createdCustomer;
    }),
});
