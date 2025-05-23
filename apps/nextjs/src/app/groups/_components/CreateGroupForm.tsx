"use client";

import { CreateGroupSchema } from "@@/db/schema";
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
import { toast } from "@@/ui/toast";

import { api } from "~/trpc/react";

export function CreateGroupForm() {
  const form = useForm({
    schema: CreateGroupSchema,
    defaultValues: {
      title: "",
    },
  });

  const utils = api.useUtils();
  const createGroup = api.groups.createGroup.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.groups.invalidate();
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to create a group"
          : "Failed to create group",
      );
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit((data) => {
          createGroup.mutate(data);
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
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
