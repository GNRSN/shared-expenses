import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@acme/db";
import { CreateGroupSchema, Group, UserToGroup } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const groupsRouter = {
  getForCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.UserToGroup.findMany({
      // REVIEW: I'm not confident that this is the correct way to query relations with drizzle?
      where: eq(UserToGroup.userId, ctx.session.user.id),
      with: {
        group: true,
      },

      // TODO: Order by recent activity, custom sorting by input?
      // REVIEW: This causes an error for UserToGroup.id not existing
      // orderBy: desc(Group.id),
      // TODO: pagination
      // limit: 10,
    });
  }),

  createGroup: protectedProcedure
    .input(CreateGroupSchema)
    .mutation(async ({ ctx, input }) => {
      const groupResult = await ctx.db
        .insert(Group)
        .values({ ...input, owner: ctx.session.user.id })
        .returning({ insertedId: Group.id });

      const groupId = groupResult[0]?.insertedId;
      if (!groupId) {
        throw new Error(
          "Type guard: Did not return insertedId. Group not created?",
        );
      }

      await ctx.db.insert(UserToGroup).values({
        userId: ctx.session.user.id,
        groupId,
      });

      return groupResult;
    }),

  addUserToGroup: protectedProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(UserToGroup).values(input);
    }),

  removeUserFromGroup: protectedProcedure
    .input(z.object({ userId: z.string(), groupId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(UserToGroup)
        .where(
          and(
            eq(UserToGroup.userId, input.userId),
            eq(UserToGroup.groupId, input.groupId),
          ),
        );
    }),

  deleteGroup: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(Group).where(eq(Group.id, input));
    }),
} satisfies TRPCRouterRecord;
