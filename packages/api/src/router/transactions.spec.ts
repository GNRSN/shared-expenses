import { createTestCaller, mockSession } from "../test-utils";

describe("transactions router", () => {
  describe("addExpense", () => {
    it("works", async () => {
      const { caller } = createTestCaller(mockSession);

      await caller.testOnly.addUser({
        id: mockSession.user.id,
        email: mockSession.user.email,
      });

      const group = await caller.groups.createGroup({
        title: "Test Group",
      });

      const result = await caller.transactions.addExpense({
        userId: mockSession.user.id,
        groupId: group.insertedId,
        description: "",
        amount: 100,
        currency: "USD",
        date: new Date("2025-03-15"),
      });

      expect(result.insertedId).toBeTruthy();
    });
  });
});
