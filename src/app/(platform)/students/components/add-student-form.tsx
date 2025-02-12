"use client";

import { faker } from "@faker-js/faker";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FormError from "@/components/form-error";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { ClassroomOption } from "@/lib/classroom/classroom.types";
import { studentCreateSchema } from "@/lib/student/student.schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddStudentFormProps {
  classrooms: Array<ClassroomOption>;
  onCancel: () => void;
}

export function AddStudentForm({ onCancel, classrooms }: AddStudentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [hasExistingFamily, setHasExistingFamily] = useState(false);

  const form = useForm<z.infer<typeof studentCreateSchema>>({
    resolver: zodResolver(studentCreateSchema),
    defaultValues: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      guardian: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof studentCreateSchema>) => {
    console.log("onSubmit", values);
    // startTransition(() => {
    //   StudentService.create(values)
    //     .then((result) => {
    //       console.log({ result });
    //       toast("Student created successfully");

    //       form.reset();
    //       onCancel();
    //     })
    //     .catch((error) => {
    //       form.setError("root", { type: "custom", message: error.message });
    //     });
    // });
  };

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
            name="classroomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classroom *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasExistingFamily"
              checked={hasExistingFamily}
              onCheckedChange={(checked) => {
                const isChecked = checked as boolean;
                setHasExistingFamily(isChecked);

                // Reset form values when toggling between guardian types
                // form.reset({
                //   ...form.getValues(),
                //   guardianId: isChecked ? "" : undefined,
                //   guardian: {
                //     name: !isChecked ? "" : undefined,
                //     email: !isChecked ? "" : undefined,
                //     phone: !isChecked ? "" : undefined,
                //   },
                // });
              }}
            />
            <label
              htmlFor="hasExistingFamily"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              This student&apos;s family already exists
            </label>
          </div>
          {hasExistingFamily ? (
            <>
              <FormField
                control={form.control}
                name="guardian.email"
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
              <FormField
                control={form.control}
                name="guardianId"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <Input type="hidden" {...field} />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="guardian.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter guardian name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guardian.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter guardian email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guardian.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian phone (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter guardian phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guardian.relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MOTHER">Mother</SelectItem>
                        <SelectItem value="FATHER">Father</SelectItem>
                        <SelectItem value="GRANDPARENT">GrandParent</SelectItem>
                        <SelectItem value="NANNY">Nanny</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        <FormError message={form.formState.errors?.root?.message} />
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isPending ? "Creating..." : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
}
