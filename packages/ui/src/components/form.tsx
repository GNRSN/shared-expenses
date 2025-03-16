"use client";

import type * as LabelPrimitive from "@radix-ui/react-label";
import type { UseTRPCMutationResult } from "@trpc/react-query/shared";
import type {
  ControllerProps,
  FieldPath,
  FieldValues,
  UseFormProps,
} from "react-hook-form";
import type { ZodSchema, z } from "zod";
import { createContext, useContext, useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useForm as useHookForm,
} from "react-hook-form";

import { Button, buttonVariants } from "@@/ui/button";
import { Label } from "@@/ui/label";
import { cn } from "@@/ui/utils";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        className={cn("space-y-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  // types are mistaken, this is a common issue with React contexts in my experience
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormLabel = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof LabelPrimitive.Root>) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
};

const FormControl = ({
  ...props
}: React.ComponentPropsWithRef<typeof Slot>) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
};

const FormDescription = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"p">) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
};

const FormMessage = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<"p">) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
};

const useForm = <TSchema extends ZodSchema>({
  schema,
  ...rest
}: Omit<UseFormProps<z.infer<TSchema>>, "resolver"> & {
  schema: TSchema;
}) => {
  return useHookForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    ...rest,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TRPCMutation = UseTRPCMutationResult<any, any, any, unknown>;

const FormSubmitButton = ({
  className,
  variant,
  size,
  children,
  mutation,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "asChild" | "type"> & {
  mutation: TRPCMutation;
}) => {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  disabled = disabled || mutation.isPending;

  return (
    <Button
      type="submit"
      disabled={disabled}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
          highlightState: mutation.isError ? "error" : undefined,
        }),
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export {
  useForm,
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormSubmitButton,
};

export { useFieldArray } from "react-hook-form";
