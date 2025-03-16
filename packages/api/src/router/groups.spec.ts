import { ERROR } from "../codes";
import { createTestCaller, mockSession } from "../test-utils";

describe("groups router", () => {
  describe("getForCurrentUser", () => {
    it("should throw unauthorized when not logged in", async () => {
      const { caller } = createTestCaller(null);

      await expect(caller.groups.getForCurrentUser()).rejects.toThrow(
        ERROR.UNAUTHORIZED,
      );
    });

    it("should return groups for logged in user", async () => {
      const { caller } = createTestCaller(mockSession);

      const result = await caller.groups.getForCurrentUser();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("createGroup", () => {
    it("should throw unauthorized when not logged in", async () => {
      const { caller } = createTestCaller(null);

      await expect(
        caller.groups.createGroup({
          title: "Test Group",
        }),
      ).rejects.toThrow(ERROR.UNAUTHORIZED);
    });

    it("should create a group with creator as owner and member", async () => {
      const { caller, ctx } = createTestCaller(mockSession);

      await caller.testOnly.addUser({
        id: mockSession.user.id,
        email: mockSession.user.email,
      });

      const result = await caller.groups.createGroup({
        title: "Test Group",
      });

      expect(result).toHaveProperty("insertedId");

      expect(
        await ctx.db.query.Group.findFirst({
          where: (groups, { eq }) => eq(groups.id, result.insertedId),
        }),
      ).toHaveProperty("owner", mockSession.user.id);

      expect(
        await ctx.db.query.UserToGroup.findFirst({
          where: (usersToGroups, { eq, and }) =>
            and(
              eq(usersToGroups.groupId, result.insertedId),
              eq(usersToGroups.userId, mockSession.user.id),
            ),
        }),
      ).toBeTruthy();
    });
  });

  describe("transferring ownership", () => {
    it.todo("allows transferring ownership");
    it.todo("throws if user is not the current owner");
  });
});
