import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "~/server/api/routers/auth";
import { customerRouter } from "~/server/api/routers/customer";
import { serviceProviderRouter } from "~/server/api/routers/serviceProviders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  customer: customerRouter,
  serviceProvider: serviceProviderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
