import { z } from "zod";
import { users } from "@clerk/nextjs/api";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Roles } from "@prisma/client";

export const authRouter = createTRPCRouter({
  isFirstLogin: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.userId,
      },
    });

    return !user;
  }),

  add: privateProcedure
    .input(
      z.object({
        role: z.enum([Roles.ADMIN, Roles.SERVICE_PROVIDER, Roles.CUSTOMER]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await users.getUser(ctx.userId);
      if (!user || !user.emailAddresses.length) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const email = user.emailAddresses[0]?.emailAddress;

      if (!email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const prismaUserResponse = await ctx.prisma.user.create({
        data: {
          id: ctx.userId,
          email,
          name: user.username,
          role: input.role,
          profileImageURL: user.profileImageUrl,
        },
      });
      return prismaUserResponse;
    }),
});
