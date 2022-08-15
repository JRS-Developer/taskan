import { env } from "@/env/server.mjs";
import { TRPCError } from "@trpc/server";
import { createApi } from "unsplash-js";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

const u = createApi({
  accessKey: env.UNSPLASH_ACCESS_KEY,
});

export const unsplashRouter = createProtectedRouter()
  .query("searchPhotos", {
    input: z
      .object({
        query: z.string().default(""),
        page: z.number().optional(),
        perPage: z.number().optional(),
        orientation: z
          .enum(["portrait", "landscape", "squarish"])
          .default("landscape"),
      })
      .optional(),
    async resolve({ input }) {
      if (!input?.query) return [];

      const photos = await u.search.getPhotos({
        ...input,
        query: input?.query,
      });

      if (photos.type === "error") {
        console.error(photos.errors);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return photos.response.results;
    },
  })
  .query("getPhotos", {
    input: z
      .object({
        page: z.number(),
        perPage: z.number(),
      })
      .partial()
      .optional(),
    async resolve({ input }) {
      const photos = await u.photos.list(input);

      if (photos.type === "error") {
        console.error(photos.errors);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return photos.response.results;
    },
  });
