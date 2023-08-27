import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import type { IApiResponse } from "~/types/apiResponseSchema";
import type { Review } from "@prisma/client";

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        orgId: z.string(),
        rating: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const createReview = await prisma.review.create({
        data: {
          rating: input.rating,
          userId: ctx.auth.userId,
          description: input.description,
          org: {
            connect: {
              id: input.orgId
            }
          }
        }
      })
      return {status: "success", data: createReview} as IApiResponse<Review>
    }),
  summary: protectedProcedure
    .input(z.object({
      orgIds: z.array(z.string()),
    }))
    .query(async ({input}) => {
      const avgRatings = await Promise.all(input.orgIds.map(async (orgId)=>{
        const avgRating = await prisma.review.aggregate({
          where: {
            orgId,
          },
          _avg: {
            rating: true,
          },
        })
        return avgRating._avg.rating ?? 0
      }))
      return {status: "success", data: avgRatings} as IApiResponse<number[]>
    })
});
