import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "~/server/db";
import { IApiResponse } from "~/types/apiResponseSchema";
import { ICustomMetadata } from "~/types/customMetadata";
import { InviteCodes } from "@prisma/client";

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
      return {status: "success", createCollected};
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
        return {status: "unauthorized",} as IApiResponse<null>
      }
      await clerkClient.users.updateUserMetadata(ctx.auth.userId, {
        privateMetadata: {
          orgId: searchCode.orgId,
        } as ICustomMetadata
      })
      return {status: "success", data: {orgId: searchCode.code}} as IApiResponse<ICustomMetadata>
    })
});
