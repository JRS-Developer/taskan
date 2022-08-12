import { inferQueryOutput } from "@/utils/trpc";

export type BoardByIdT = inferQueryOutput<"boards.getOneById">;

export type BoardColumnByIdT = BoardByIdT["lists"][0];

export type BoardCardByIdT = BoardColumnByIdT["cards"][0];
