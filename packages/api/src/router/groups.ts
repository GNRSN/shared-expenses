import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@@/db";
import { CreateGroupSchema, Group, UserToGroup } from "@@/db/schema";

import {
  groupMemberProcedure,
  groupOwnerProcedure,
  protectedProcedure,
} from "../trpc";

export const groupsRouter = {
  getGroup: groupMemberProcedure.query(({ ctx, input }) => {
    return ctx.db.query.Group.findFirst({
      where: eq(Group.id, input.groupId),
      with: {
        userToGroup: {
          columns: {},
          with: {
            user: true,
          },
        },
      },
    });
  }),

  getForCurrentUser: protectedProcedure.query(({ ctx }) => {
    /**
     *REVIEW: I'm not confident that this is the correct way to query relations with drizzle?
     *
     * Where we can get users directly instead of traversing the relation
     * (drizzle should know that this is a relation and not a regular record)
     *
     * What I'm after is that currently, members resolves to userToGroup.group.userToGroup.members[]
     * I would prefer to simplify this to group.members[]
     */
    return ctx.db.query.UserToGroup.findMany({
      where: eq(UserToGroup.userId, ctx.session.user.id),
      columns: {},
      with: {
        group: {
          with: {
            userToGroup: {
              columns: {},
              with: {
                user: true,
              },
            },
          },
        },
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

  addUserToGroup: groupOwnerProcedure
    .input(z.object({ userId: z.string().cuid2() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(UserToGroup).values(input);
    }),

  removeUserFromGroup: groupOwnerProcedure
    .input(z.object({ userId: z.string().cuid2() }))
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

  makeMemberOwner: groupOwnerProcedure
    .input(z.object({ userId: z.string().cuid2() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(Group)
        .set({ owner: input.userId })
        .where(eq(Group.id, input.groupId));
    }),

  deleteGroup: groupOwnerProcedure.mutation(({ ctx, input }) => {
    return ctx.db.delete(Group).where(eq(Group.id, input.groupId));
  }),
} satisfies TRPCRouterRecord;
