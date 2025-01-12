import type { Meta, StoryObj } from "@storybook/react";

import { withTrpcContext } from "~/trpc/storybook";
import { PostCard, PostCardSkeleton } from "./posts";

/**
 * POC for NextJS stories, supporting tailwind, fonts, theme and mocking TRPC
 * when we remove the posts showcase we can get rid of this
 */

const meta = {
  title: "Posts/Card",
  component: undefined,
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
