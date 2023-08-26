import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "~/server/db";
import { IApiResponse } from "~/types/apiResponseSchema";
import { ICustomMetadata } from "~/types/customMetadata";
import { Collected, Org } from "@prisma/client";

export const userRouter = createTRPCRouter({
  collected: protectedProcedure
    .input(z.object({ 
      postId: z.string(),
      quantity: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const createCollected = await prisma.collected.create({
        data: {
          quantity: input.quantity,
          userId: ctx.auth.userId,
          post: {
            connect: {
              id: input.postId
            }
          }
        }
      })
      return {status: "success", data: createCollected} as IApiResponse<Collected>;
    }),
  joinOrg: protectedProcedure
    .input(z.object({
      inviteCode: z.string(),
    }))
    .mutation(async ({ctx, input}) => {
      const currentDate = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(currentDate.getDate() - 7);
      const searchCode = await prisma.inviteCodes.findFirst({
        where: {
          code: input.inviteCode,
          createdAt: {
            gte: sevenDaysAgo,
            lte: currentDate,
          }
        }
      })
      if(!!!searchCode){
        return {status: "unauthorized",} as IApiResponse<ICustomMetadata>
      }
      await clerkClient.users.updateUserMetadata(ctx.auth.userId, {
        privateMetadata: {
          orgId: searchCode.orgId,
        } as ICustomMetadata
      })
      return {status: "success", data: {orgId: searchCode.code}} as IApiResponse<ICustomMetadata>
    }),
  getOrg: protectedProcedure
    .query(async ({ctx}) => {
      const data = await clerkClient.users.getUser(ctx.auth.userId)
      const { orgId } = data.privateMetadata as ICustomMetadata
      if(!!!orgId){
        return {status: "unauthorized"} as IApiResponse<Org>
      }
      const orgData = await prisma.org.findFirst({
        where: {
          id: orgId
        }
      })
      return {status: "success", data: orgData} as IApiResponse<Org>
    })
});
