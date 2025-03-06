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
      return ctx.db.insert(Transaction).values({
        groupId: input.groupId,
        amount: input.amount,
        description: input.description,
        userId: input.userId,
        currency: input.currency,
        type: "expense",
        date: input.date,
      });
    }),

  addSettlement: groupMemberProcedure
    .input(CreateTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(Transaction).values({
        groupId: input.groupId,
        amount: input.amount,
        description: input.description,
        userId: input.userId,
        currency: input.currency,
        type: "settlement",
        date: input.date,
      });
    }),
} satisfies TRPCRouterRecord;
