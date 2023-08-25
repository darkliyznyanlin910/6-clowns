import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";

import crypto from "crypto";
import { Bucket } from "sst/node/bucket";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ICustomMetadata } from "~/types/customMetadata";
import { IApiResponse } from "~/types/apiResponseSchema";
import { addressSchema } from "~/types/address";
import geoCode from "~/utils/geo-coding";
import { prisma } from "~/server/db";
import { Post } from "@prisma/client";
import getOrgId from "~/utils/getOrgId";

const radius = 0.004

export const postRouter = createTRPCRouter({
  signUrl: protectedProcedure
    .input(z.object({
      imageNames: z.array(z.string()),
      postAs: z.enum(["user", "org"])
    }))
    .mutation(async ({ctx, input}) => {
      let id = ""
      id = ctx.auth.userId
      if(input.postAs == "org"){
        const orgId = await getOrgId(ctx.auth.userId)
        if(!!!orgId){
          return {status: "unauthorized"} as IApiResponse<null>
        }
      }
      const s3 = new S3Client({})
      const urls = await Promise.all(input.imageNames.map(async () => {
        const command = new PutObjectCommand({
          ACL: "public-read",
          Key: `${id}-${crypto.randomUUID()}`,
          Bucket: Bucket.public.bucketName,
        });
        const url = await getSignedUrl(s3, command);
        return url
      }))
      return {status: "success", data: urls} as IApiResponse<string[]>
    }),
  create: protectedProcedure
    .input(z.object({
      description: z.string(),
      images: z.array(z.string()),
      quantity: z.number(),
      address: addressSchema,
      bestBefore: z.date(),
      postAs: z.enum(["user", "org"])
    }))
    .mutation(async ({ctx,input}) => {
      const {lat, lon} = geoCode(input.address)
      let createPost: Post
      if(input.postAs == "org"){
        const orgId = await getOrgId(ctx.auth.userId)
        if(!!!orgId){
          return {status: "unauthorized"} as IApiResponse<null>
        }
        createPost = await prisma.post.create({
          data: {
            userId: ctx.auth.userId,
            description: input.description,
            org: {
              connect: {
                id: orgId
              }
            },
            images: {
              createMany: {
                data: input.images.map((image) => ({
                  url: image
                }))
              }
            },
            quantity: input.quantity,
            address: input.address,
            lat,
            lon,
            bestBefore: input.bestBefore,
          }
        })
      } else {
        const {firstName, lastName} = await clerkClient.users.getUser(ctx.auth.userId)
        createPost = await prisma.post.create({
          data: {
            userId: ctx.auth.userId,
            ownerName: `${firstName} ${lastName}`,
            description: input.description,
            images: {
              createMany: {
                data: input.images.map((image) => ({
                  url: image
                }))
              }
            },
            quantity: input.quantity,
            address: input.address,
            lat,
            lon,
            bestBefore: input.bestBefore,
          }
        })
      }
      return {status: "success", data: createPost} as IApiResponse<Post>
    }),
  get: protectedProcedure
    .input(z.object({
      lat: z.number(),
      lon: z.number(),
    }).optional())
    .query(async ({input}) => {
      const getPosts = await prisma.post.findMany({
        where: {
          lat: {
            gt: input?.lat && (input?.lat - radius),
            lt: input?.lat && (input?.lat + radius),
          },
          lon: {
            gt: input?.lon && (input?.lon - radius),
            lt: input?.lon && (input?.lon + radius),
          },
        }
      })
      if(getPosts.length < 1){
        return {status: "error", } as IApiResponse<null>
      }
      return {status: "success", data: getPosts} as IApiResponse<Post[]>
    })
});
  