import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";

import crypto from "crypto";
import { 
  // S3Client, 
  PutObjectCommand 
} from "@aws-sdk/client-s3";
import { s3 } from "~/utils/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IApiResponse } from "~/types/apiResponseSchema";
import { addressSchema } from "~/types/address";
import geoCode from "~/utils/geo-coding";
import { prisma } from "~/server/db";
import { Post } from "@prisma/client";
import getOrgId from "~/utils/getOrgId";
import { PostFull } from "~/types/postFull";
import { env } from "~/env.mjs";

const radius = 0.015

export const postRouter = createTRPCRouter({
  signUrl: protectedProcedure
    .input(z.object({
      imageTypes: z.array(z.string()),
      postAs: z.enum(["user", "org"])
    }))
    .mutation(async ({ctx, input}) => {
      let id = ""
      id = ctx.auth.userId
      if(input.postAs == "org"){
        const orgId = await getOrgId(ctx.auth.userId)
        if(!!!orgId){
          return { status: "unauthorized" } as IApiResponse<{signedUrls: string[], sources: string[]}>
        }
      }
      const urls = await Promise.all(input.imageTypes.map(async (imageType) => {
        const key = `postImages/${id}-${crypto.randomUUID()}`
        const command = new PutObjectCommand({
          ACL: "public-read",
          Key: key,
          Bucket: env.BUCKET_NAME,
          ContentType: imageType,
        });
        // const signedUrl = await getSignedUrl(s3, command);
        const signedUrl = await s3.getSignedUrlPromise("putObject", command);
        const source = `https://${env.BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${key}}`;
        return {signedUrl, source}
      }))
      const data: {
        signedUrls: string[];
        sources: string[];
      } = {
          signedUrls: urls.map(urlObj => urlObj.signedUrl),
          sources: urls.map(urlObj => urlObj.source),
      };
      return {status: "success", data} as IApiResponse<{signedUrls: string[], sources: string[]}>
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
          return { status: "unauthorized" } as IApiResponse<Post>
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
  getMultiple: protectedProcedure
    .input(z.object({
      lat: z.number().optional(),
      lon: z.number().optional(),
      limit: z.number().min(1).max(24).nullish(),
      cursor: z.string().nullish(),
      showHistory: z.boolean(),
      orgId: z.string().optional()
    }))
    .query(async ({input}) => {
      const limit = input.limit ?? 12;
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
          quantity: (input.showHistory ? undefined : {
            gt: 0,
          })
        },
        include: {
          images: true,
          org: true,
        },
        take: limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      })
      if(getPosts.length < 1){
        return {status: "error", } as IApiResponse<{getPosts: PostFull[], nextCursor: string}>
      }
      let nextCursor: typeof input.cursor | undefined = undefined;

      if (getPosts.length > limit) {
        const nextItem = getPosts.pop();
        nextCursor = nextItem!.id;
      }

      return {status: "success", data: {getPosts, nextCursor}} as IApiResponse<{getPosts: PostFull[], nextCursor: string}>
    }),
  getOne: protectedProcedure
    .input(z.object({
      postId: z.string()
    }))
    .query(async ({input}) => {
      const getPost = await prisma.post.findFirst({
        where: {
          id: input.postId
        },
        include: {
          images: true,
          org: true,
        },
      })
      if(!!!getPost) {
        return {status: "error"} as IApiResponse<PostFull>
      }
      return {status: "success", data: getPost} as IApiResponse<PostFull>
    })
});
  