import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@@/db";
import { CreateTransactionSchema, Transaction } from "@@/db/schema";

import { groupMemberProcedure } from "../trpc";

export const transactionsRouter = {
  // TODO: Pagination
  getTransactionsForGroup: groupMemberProcedure.query(
    async ({ ctx, input }) => {
      return await ctx.db.query.Transaction.findMany({
        where: eq(Transaction.groupId, input.groupId),
      });
    },
  ),

  addExpense: groupMemberProcedure
    .input(CreateTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(Transaction)
        .values({
          ...input,
          type: "expense",
        })
        .returning({ insertedId: Transaction.id });

      if (!result) {
        throw new Error(
          "Type guard: Did not return insertedId. Transaction not created?",
        );
      }
      return result;
    }),

  addSettlement: groupMemberProcedure
    .input(CreateTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(Transaction).values({
        ...input,
        type: "settlement",
      });
    }),
} satisfies TRPCRouterRecord;
