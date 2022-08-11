// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { boardsRouter } from "./boards";
import { columnsRouter } from "./columns";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("boards.", boardsRouter)
  .merge("columns.", columnsRouter)
  .merge("question.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
