import type { Session } from "@/auth";

import { appRouter, createTRPCContext } from ".";
import { createCallerFactory } from "./trpc";

// Mock session data
export const mockSession: Session = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Create a test context with optional session override
export async function createTestContext(session: Session | null = null) {
  return createTRPCContext({
    session,
    headers: new Headers(),
  });
}

// Create a test caller with the given session
export async function createTestCaller(session: Session | null = null) {
  const ctx = await createTestContext(session);
  const caller = createCallerFactory(appRouter)(ctx);
  return { caller, ctx };
}
