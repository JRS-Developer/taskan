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
    input: z.object({ query: z.string().default("") }),
    async resolve({ input }) {
      const photos = await u.search.getPhotos(input);

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
    async resolve() {
      const photos = await u.photos.list({
        page: 1,
      });

      if (photos.type === "error") {
        console.error(photos.errors);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return photos.response.results;
    },
  });
