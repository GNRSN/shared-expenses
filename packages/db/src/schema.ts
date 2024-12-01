// Lets see if this is needed/useful
// import type { AdapterAccountType } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * TODO: Configure timestamps to fit a format we like, the docs are a bit confusing
 * regarding integer { mode: timestamp_ms } vs text with CURRENT_TIMESTAMP default
 * https://github.com/drizzle-team/drizzle-orm/issues/1105
 */
const createdAt = text("created_at")
  .default(sql`(CURRENT_TIMESTAMP)`)
  .notNull();

const updatedAt = text("updatedAt").$onUpdate(() => sql`(CURRENT_TIMESTAMP)`);

/**
 * REVIEW: Nit: Naming convention, plural (table) or singular (model)?
 * REVIEW: Nit2: Naming convention, should columns be named in snake or camel case?
 */

export const Post = sqliteTable("post", {
  id: text("id").notNull().primaryKey().$default(createId),
  title: text("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt,
  updatedAt,
});

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const User = sqliteTable("user", {
  id: text("id").notNull().primaryKey().$default(createId),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image", { length: 255 }),
  createdAt,
});

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
  userToGroup: many(UserToGroup),
}));

export const Group = sqliteTable("user_group", {
  id: text("id").notNull().primaryKey().$default(createId),
  title: text("title", { length: 256 }).notNull(),
  owner: text("owner_id")
    .notNull()
    .references(() => User.id, {
      // TODO: How to handle deletions?
      // onDelete: "cascade",
    }),
  createdAt,
});

export const CreateGroupSchema = createInsertSchema(Group, {
  title: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  owner: true,
});

export const GroupRelations = relations(Group, ({ many }) => ({
  userToGroup: many(UserToGroup),
}));

/**
 * REVIEW: Users-to-Groups relation modeled after https://orm.drizzle.team/docs/rqb#declaring-relations
 */
export const UserToGroup = sqliteTable(
  "user_to_group",
  {
    userId: text("userId")
      .notNull()
      .references(() => User.id),
    groupId: text("groupId")
      .notNull()
      .references(() => Group.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  }),
);

export const CreateUserGroupRelationSchema = createInsertSchema(UserToGroup, {
  userId: z.string().cuid(),
  groupId: z.string().cuid(),
});

export const UserToGroupRelations = relations(UserToGroup, ({ one }) => ({
  group: one(Group, {
    fields: [UserToGroup.groupId],
    references: [Group.id],
  }),
  user: one(User, {
    fields: [UserToGroup.userId],
    references: [User.id],
  }),
}));

export const Account = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: text("type", { length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token", { length: 255 }),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = sqliteTable("session", {
  sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));
