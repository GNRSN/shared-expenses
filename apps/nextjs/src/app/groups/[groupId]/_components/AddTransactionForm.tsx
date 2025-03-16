import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { z } from "zod";

import { Button } from "@@/ui/button";
import { Calendar } from "@@/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSubmitButton,
  useForm,
} from "@@/ui/form";
import { Input } from "@@/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/ui/select";
import { AVAILABLE_CURRENCIES, zCurrencyEnum } from "@@/validators";

import { api } from "~/trpc/react";

const formSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: zCurrencyEnum,
  title: z.string().min(1, "Title is required"),
  date: z.date(),
  note: z.string(),
  paidBy: z.string().cuid2(),
});

export const AddTransactionForm = ({
  userId,
  groupId,
  collapseForm,
}: {
  userId: string;
  groupId: string;
  collapseForm: () => void;
}) => {
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      title: "",
      currency: "USD",
      amount: 0,
      note: "",
      date: new Date(),
      paidBy: userId,
    },
  });

  const utils = api.useUtils();
  const addExpense = api.transactions.addExpense.useMutation({
    onSuccess: async () => {
      await utils.transactions.invalidate();
      collapseForm();
      form.reset();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addExpense.mutate({
      // LATER: Should be able to select other user to log expenses for others
      userId,
      groupId,
      amount: values.amount,
      description: values.note,
      currency: values.currency,
      date: values.date,
    });
  }

  const limitUpperBound = new Date();
  const limitLowerBound = new Date("2021-01-01");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Short and concise..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          // LATER: Maybe should have been a combobox instead?
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AVAILABLE_CURRENCIES.map((currency) => (
                      <SelectItem
                        key={currency}
                        value={currency}
                      >
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Input
                  placeholder="Any additional details..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {format(field.value, "PPP")}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > limitUpperBound || date < limitLowerBound
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton
          className="w-full"
          mutation={addExpense}
        >
          Add Transaction
        </FormSubmitButton>
      </form>
    </Form>
  );
};
