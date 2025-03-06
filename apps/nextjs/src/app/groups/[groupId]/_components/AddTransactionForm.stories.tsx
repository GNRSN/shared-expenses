import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "@@/ui/card";

import { withTrpcContext } from "~/trpc/storybook";
import { AddTransactionForm } from "./AddTransactionForm";

/**
 * POC for NextJS stories, supporting tailwind, fonts, theme and mocking TRPC
 * when we remove the posts showcase we can get rid of this
 */

const meta = {
  title: "Groups/AddTransactionForm",
  component: undefined,
} satisfies Meta<typeof AddTransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  decorators: [
    withTrpcContext((ctx) => {
      ctx.transactions.addExpense.setMutationDefaults({});
    }),
  ],
  render: () => (
    <Card className="max-w-md p-4">
      <AddTransactionForm
        userId="1"
        groupId="1"
        onSuccess={() => window.alert("success")}
      />
    </Card>
  ),
};
