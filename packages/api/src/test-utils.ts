import { mergeRouters } from "@trpc/server/unstable-core-do-not-import";
import { vi } from "vitest";

import type { Session } from "@@/auth";
// NOTE: In test environment, this will point to local sqlite db instead of Turso
// (controlled though env var)
import { db } from "@@/db/client";
import { runDevMigrations } from "@@/db/utils";

import type { TRPCContext } from "./trpc";
import { appRouter } from ".";
import { testOnlyRouter } from "./router/test-only";
import { createCallerFactory, createTRPCRouter } from "./trpc";

// Mock @@/auth module
// We didn't end up consuming it for now but importing it has side effects,
// e.g. validate env
vi.mock("@@/auth", () => ({
  auth: vi.fn(),
  validateToken: vi.fn(),
}));

await runDevMigrations(db);

// Mock session data
export const mockSession = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
} as const satisfies Session;

// Create a test context with optional session override
function createTestContext(session: Session | null = null): TRPCContext {
  // Bypass the auth() call by providing session directly
  return {
    session,
    db,
    token: null,
  };
}

// Create a test caller with the given session
export function createTestCaller(session: Session | null = null) {
  const ctx = createTestContext(session);
  const caller = createCallerFactory(
    mergeRouters(appRouter, createTRPCRouter({ testOnly: testOnlyRouter })),
  )(ctx);
  return { caller, ctx };
}
