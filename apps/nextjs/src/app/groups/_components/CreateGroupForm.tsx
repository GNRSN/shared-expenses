import { CreateGroupSchema } from "@acme/db/schema";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";

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
          createGroup.mutate(data);
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Title" />
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
