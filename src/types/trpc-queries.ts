import { inferQueryOutput } from "@/utils/trpc";

// Board types
export type BoardByIdT = inferQueryOutput<"boards.getOneById">;
export type BoardColumnByIdT = BoardByIdT["lists"][0];
export type BoardCardByIdT = BoardColumnByIdT["cards"][0];

// Card types
export type CardByIdT = inferQueryOutput<"cards.getOneById">;

// Unsplash types
export type UnsplashPhotoT = inferQueryOutput<"unsplash.getPhotos">[0];
