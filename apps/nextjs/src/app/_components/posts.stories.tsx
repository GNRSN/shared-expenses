import type { Meta, StoryObj } from "@storybook/react";

import { StorybookTrpcProvider, withTrpcContext } from "~/trpc/storybook";
import { PostCard, PostCardSkeleton } from "./posts";

const meta = {
  title: "Posts/Card",
  component: undefined,
  decorators: [
    (Story) => (
      <StorybookTrpcProvider>
        <Story />
      </StorybookTrpcProvider>
    ),
  ],
} satisfies Meta<typeof PostCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  decorators: [
    withTrpcContext((ctx) => {
      ctx.post.delete.setMutationDefaults({});
    }),
  ],
  render: () => (
    <PostCard
      post={{
        title: "Example",
        id: "1",
        content: "Content",
        createdAt: "2023-01-01",
        updatedAt: null,
      }}
    />
  ),
};

export const Skeleton = {
  render: () => <PostCardSkeleton />,
};
