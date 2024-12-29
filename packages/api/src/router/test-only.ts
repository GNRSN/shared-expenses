import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { User } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const testOnlyRouter = {
  /** AuthJS does this for us at account registration but for tests we will need to add users manually */
  addUser: protectedProcedure
    .input(z.object({ id: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(User)
        .values({
          id: input.id,
          email: input.email,
        })
        .returning({ insertedId: User.id });
    }),
} satisfies TRPCRouterRecord;
