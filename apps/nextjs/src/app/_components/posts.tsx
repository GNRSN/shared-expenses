"use client";

import { use } from "react";

import type { RouterOutputs } from "@@/api";
import { CreatePostSchema } from "@@/db/schema";
import { Button } from "@@/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@@/ui/form";
import { Input } from "@@/ui/input";
import { Skeleton } from "@@/ui/skeleton";
import { toast } from "@@/ui/toast";

import { api } from "~/trpc/react";

export function CreatePostForm() {
  const form = useForm({
    schema: CreatePostSchema,
    defaultValues: {
      content: "",
      title: "",
    },
  });

  const utils = api.useUtils();
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.post.invalidate();
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to post"
          : "Failed to create post",
      );
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit((data) => {
          createPost.mutate(data);
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Content"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Create</Button>
      </form>
    </Form>
  );
}

export function PostList(props: {
  posts: Promise<RouterOutputs["post"]["all"]>;
}) {
  // TODO: Make `useSuspenseQuery` work without having to pass a promise from RSC
  // NOTE: ^ This todo is from the starter
  // They replaced it with a pre-fetch call but that caused extreme slowness for me
  // with errors pointing to the cache being filled with something too big to
  // serialize, even if I hardcoded an empty array to be returned
  // likely trpc 11 isn't ready for that yet
  const initialData = use(props.posts);
  const { data: posts } = api.post.all.useQuery(undefined, {
    initialData,
  });

  if (posts.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No posts yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {posts.map((p) => {
        return (
          <PostCard
            key={p.id}
            post={p}
          />
        );
      })}
    </div>
  );
}

export function PostCard(props: {
  post: RouterOutputs["post"]["all"][number];
}) {
  const utils = api.useUtils();
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to delete a post"
          : "Failed to delete post",
      );
    },
  });

  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-primary">{props.post.title}</h2>
        <p className="mt-2 text-sm">{props.post.content}</p>
      </div>
      <div>
        <Button
          variant="ghost"
          className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
          onClick={() => deletePost.mutate(props.post.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <Skeleton
          as="h2"
          className="w-1/4 rounded text-2xl font-bold"
        />
        <Skeleton
          as="p"
          className="mt-2 w-1/3 rounded text-sm"
        />
      </div>
    </div>
  );
}
