import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { IApiResponse } from "~/types/apiResponseSchema";
import { Org } from "@prisma/client";
import { hash } from "argon2";

export const orgRouter = createTRPCRouter({
  getDetails: protectedProcedure
    .input(z.object({
      orgId: z.string(),
    }))
    .query(async ({input}) => {
      const getOrg = await prisma.org.findFirst({
        where: {
          id: input.orgId
        }
      })
      if(!!!getOrg){
        return {status: "error"} as IApiResponse<Org>
      }
      return {status: "success", data: getOrg} as IApiResponse<Org>
    }),
  qrStringGenerator: protectedProcedure
    .input(z.object({
      orgId: z.string(),
      createdAt: z.date(),
    }))
    .query(async ({input}) => {
      const hash2 = await hash(input.createdAt.toDateString());
      return `${input.orgId}+${hash2}`
    })
})