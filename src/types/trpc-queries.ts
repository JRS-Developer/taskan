import { inferQueryOutput } from "@/utils/trpc";

export type BoardColumnByIdT =
  inferQueryOutput<"boards.getOneById">["lists"][0];

export type BoardCardByIdT = BoardColumnByIdT["cards"][0];
