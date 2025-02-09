"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ClassroomOption } from "@/services/classroom";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  classroom: z.string().min(1, "Classroom is required"),
  guardian: z.string().min(1, "Guardian is required"),
});

interface AddStudentFormProps {
  classrooms: Array<ClassroomOption>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export function AddStudentForm({
  onSubmit,
  onCancel,
  classrooms,
}: AddStudentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      classroom: "",
      guardian: "",
    },
  });

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="classroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classroom *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a classroom" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="border-b pb-1 mb-2">
                      <Link
                        href="/classrooms"
                        className={cn(
                          buttonVariants({ variant: "secondary" }),
                          "w-full flex justify-between"
                        )}
                      >
                        Create new class
                        <PlusIcon />
                      </Link>
                    </div>
                    {classrooms.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center p-4">
                        No classrooms available
                      </p>
                    ) : (
                      classrooms.map((classroom) => (
                        <SelectItem key={classroom.id} value={classroom.id}>
                          {classroom.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guardian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Find a guardian or family *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter existing guardian name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Finish</Button>
        </div>
      </form>
    </Form>
  );
}
