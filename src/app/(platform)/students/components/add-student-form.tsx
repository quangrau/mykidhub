"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { cn } from "@/lib/utils";
import { ClassroomOption } from "@/services/classroom";
import { faker } from "@faker-js/faker";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { addStudentAction } from "../actions";
import { StudentFormData, studentFormSchema } from "../data/schema";

interface AddStudentFormProps {
  classrooms: Array<ClassroomOption>;
  onCancel: () => void;
}

export function AddStudentForm({ onCancel, classrooms }: AddStudentFormProps) {
  const [hasExistingFamily, setHasExistingFamily] = useState(false);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      classroomId: "",
      guardian: {
        id: "",
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        relationship: "parent",
      },
    },
  });

  async function onSubmit(values: StudentFormData) {
    // Process form data
    const studentData = {
      firstName: values.firstName,
      lastName: values.lastName,
      classroomId: values.classroomId,
      guardian: {
        id: values.guardian?.id || undefined,
        name: values.guardian?.name,
        email: values.guardian?.email,
        phone: values.guardian?.phone,
        relationship: values.guardian?.relationship,
      },
    };

    // TODO: Call API to create student
    const result = await addStudentAction(studentData);
    if (result?.error) {
      form.setError("firstName", { type: "custom", message: result.error });
    } else {
      form.reset();
      onCancel();
    }
  }

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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasExistingFamily"
              checked={hasExistingFamily}
              onCheckedChange={(checked) => {
                const isChecked = checked as boolean;
                setHasExistingFamily(isChecked);

                // Reset form values when toggling between guardian types
                form.reset({
                  ...form.getValues(),
                  guardian: {
                    id: isChecked ? "" : undefined,
                    name: !isChecked ? "" : undefined,
                    email: !isChecked ? "" : undefined,
                    phone: !isChecked ? "" : undefined,
                    relationship: !isChecked ? "" : undefined,
                  },
                });
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
                        onChange={(e) => {
                          field.onChange(e);
                          // Reset guardianId when guardian name changes
                          form.setValue("guardian.id", "123456");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guardian.id"
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
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="guardian">Nanny</SelectItem>
                        <SelectItem value="grandmother">Grandmother</SelectItem>
                        <SelectItem value="grandfather">Grandfather</SelectItem>
                        <SelectItem value="neighbor">Neighbor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
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
