import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "~/server/db";
import type { IApiResponse } from "~/types/apiResponseSchema";
import type { ICustomMetadata } from "~/types/customMetadata";
import type { Collected, Org } from "@prisma/client";
import { verify } from "argon2";

export const userRouter = createTRPCRouter({
  collect: protectedProcedure
    .input(z.object({ 
      postId: z.string(),
      orgId: z.string(),
      hash: z.any(),
      quantity: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const findOrg = await prisma.org.findFirst({
        where: {
          id: input.orgId,
        }
      })
      if(!!!findOrg) {
        return {status: "error"} as IApiResponse<Collected>;
      }
      const check = await verify(input.hash,findOrg.name)

      if(!check){
        return {status: "unauthorized"} as IApiResponse<Collected>;
      }
      await prisma.post.update({
        where: {
          id: input.postId
        },
        data: {
          quantity: {
            decrement: input.quantity
          }
        }
      })
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
        },
        include: {
          org: true,
        }
      })
      if(!!!searchCode){
        return {status: "unauthorized",} as IApiResponse<Org>
      }
      await clerkClient.users.updateUserMetadata(ctx.auth.userId, {
        publicMetadata: {
          orgId: searchCode.orgId,
        } as ICustomMetadata,
      })
      return {status: "success", data: searchCode.org} as IApiResponse<Org>
    }),
  getOrg: protectedProcedure
    .query(async ({ctx}) => {
      const data = await clerkClient.users.getUser(ctx.auth.userId)
      const { orgId } = data.publicMetadata as ICustomMetadata
      if(!!!orgId){
        return {status: "unauthorized"} as IApiResponse<Org>
      }
      const orgData = await prisma.org.findFirst({
        where: {
          id: orgId
        }
      })
      return {status: "success", data: orgData} as IApiResponse<Org>
    }),
});
