"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addClassroomAction } from "../actions";

export const schema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  capacity: z.coerce.number().int().min(1),
});

export type FormValues = z.infer<typeof schema>;

interface Props {
  onCancel: () => void;
}

export function AddClassroomForm({ onCancel }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      capacity: 30,
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await addClassroomAction(values);

    if (result?.error) {
      form.setError("name", { type: "custom", message: result.error });
    } else {
      form.reset();
      onCancel();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Class A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input type="number" step="1" placeholder="30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* {state?.error && (
          <div className="text-sm text-red-500 dark:text-red-400">
            {state?.error}
          </div>
        )} */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
