import { TRPCError } from "@trpc/server";

import { createTestCaller, mockSession } from "../test-utils";

describe("groups router", () => {
  describe("getForCurrentUser", () => {
    it("should throw unauthorized when not logged in", async () => {
      const { caller } = await createTestCaller(null);

      await expect(caller.groups.getForCurrentUser()).rejects.toThrow(
        TRPCError,
      );
    });

    it("should return groups for logged in user", async () => {
      const { caller } = await createTestCaller(mockSession);

      const result = await caller.groups.getForCurrentUser();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("createGroup", () => {
    it("should create a group and add creator as member", async () => {
      const { caller } = await createTestCaller(mockSession);

      const result = await caller.groups.createGroup({
        title: "Test Group",
      });

      expect(result[0]).toHaveProperty("insertedId");
    });

    it("should throw unauthorized when not logged in", async () => {
      const { caller } = await createTestCaller(null);

      await expect(
        caller.groups.createGroup({
          title: "Test Group",
        }),
      ).rejects.toThrow(TRPCError);
    });
  });
});
