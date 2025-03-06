import { authRouter } from "./router/auth";
import { groupsRouter } from "./router/groups";
import { postRouter } from "./router/post";
import { transactionsRouter } from "./router/transactions";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  groups: groupsRouter,
  transactions: transactionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
