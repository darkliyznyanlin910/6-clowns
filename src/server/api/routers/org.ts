import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import type { IApiResponse } from "~/types/apiResponseSchema";
import type { Org } from "@prisma/client";
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
      orgName: z.string(),
    }))
    .query(async ({input}) => {
      const hash2 = await hash(input.orgName);
      return `${input.orgId}~!@#$%${hash2}`
    })
})