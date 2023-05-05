import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Expertise, Professions, Day, Time } from "@prisma/client";

const EXPERTISE: [Expertise, ...Expertise[]] = [
  Expertise.ARMY_PREPARATION,
  ...Object.values(Expertise),
];

const PROFESSIONS: [Professions, ...Professions[]] = [
  Professions.NUTRITIONIST,
  ...Object.values(Professions),
];

const DAYS: [Day, ...Day[]] = [Day.MONDAY, ...Object.values(Day)];

const TIME: [Time, ...Time[]] = [Time.EIGHT_AM, ...Object.values(Time)];

export const serviceProviderRouter = createTRPCRouter({
  add: privateProcedure
    .input(
      z.object({
        services: z.array(
          z.object({
            name: z.string(),
            price: z.number(),
            duration: z.number(),
            location: z.object({
              address: z.string(),
              city: z.string(),
              country: z.string(),
              state: z.string(),
              zip: z.string(),
            }),
          })
        ),
        availability: z.array(
          z.object({
            day: z.enum(DAYS),
            time: z.array(z.enum(TIME)),
          })
        ),
        profession: z.enum(PROFESSIONS),
        expertise: z.array(z.enum(EXPERTISE)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { availability, expertise, profession, services } = input;

      await ctx.prisma.location.createMany({
        data: services.map((service) => ({
          address: service.location.address,
          city: service.location.city,
          state: service.location.state,
          zip: service.location.zip,
          country: service.location.country,
          name: `${ctx.userId}__${service.name}`,
        })),
      });

      const createdLocations = await ctx.prisma.location.findMany({
        where: {
          name: {
            in: services.map((service) => `${ctx.userId}__${service.name}`),
          },
        },
      });

      const createdServiceProvider = await ctx.prisma.serviceProvider.create({
        data: {
          profession,
          expertise,
          userId: ctx.userId,
        },
      });

      await ctx.prisma.service.createMany({
        data: services.map((service) => ({
          name: service.name,
          price: service.price,
          duration: service.duration,
          locationId:
            createdLocations.find(
              (location) => location.name === `${ctx.userId}__${service.name}`
            )?.id || -1,
          serviceProviderId: createdServiceProvider.id,
        })),
      });

      const createdSchedule = await ctx.prisma.schedule.create({
        data: {
          serviceProviderId: createdServiceProvider.id,
        },
      });

      await ctx.prisma.availability.createMany({
        data: availability.map((day) => ({
          day: day.day,
          time: day.time,
          scheduleId: createdSchedule.id,
        })),
      });

      const serviceProvider = await ctx.prisma.serviceProvider.findUnique({
        where: {
          id: createdServiceProvider.id,
        },
        include: {
          user: true,
          services: {
            include: {
              location: true,
            },
          },
          schedule: {
            include: {
              availability: true,
            },
          },
        },
      });

      return serviceProvider;
    }),
});
