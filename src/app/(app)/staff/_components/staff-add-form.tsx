"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassroomOption } from "@/lib/classroom/classroom.types";
import { staffCreateUpdateSchema } from "@/lib/staff/staff.schema";
import {
  StaffCreateUpdateData,
  StaffWithStatus,
} from "@/lib/staff/staff.types";
import { toast } from "sonner";
import { addStaffAction, editStaffAction } from "../actions";

interface AddStaffFormProps {
  currentRow?: StaffWithStatus;
  classrooms: Array<ClassroomOption>;
  onCancel: () => void;
}

export function StaffAddForm({
  onCancel,
  classrooms,
  currentRow,
}: AddStaffFormProps) {
  const isEdit = !!currentRow;
  const [isPending, startTransition] = useTransition();
  const form = useForm<StaffCreateUpdateData>({
    resolver: zodResolver(staffCreateUpdateSchema),
    defaultValues: isEdit
      ? {
          phone: "",
          classroomId: "",
          ...currentRow,
        }
      : {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number({ style: "international" }),
          role: "teacher",
          classroomId: "",
        },
  });

  const onSubmit = async (values: StaffCreateUpdateData) => {
    startTransition(async () => {
      let result;
      try {
        if (isEdit) {
          result = await editStaffAction(values);
        } else {
          result = await addStaffAction(values);
        }
      } catch (error) {
        console.log(error);
        result = {
          success: false,
          message: "Something went wrong",
        };
      }

      if (result.success) {
        toast.success(result.message);
        onCancel();
      } else {
        form.setError("root", {
          type: "custom",
          message: result.message,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="(XXX) XXX-XXXX" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    disabled={isEdit}
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classroomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classroom (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" aria-disabled={isPending} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
