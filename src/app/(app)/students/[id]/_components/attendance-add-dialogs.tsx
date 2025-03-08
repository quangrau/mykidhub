"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { StudentAttendance } from "@/lib/attendance/attendance.types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@prisma/client";
import { createAttendanceAction, editAttendanceAction } from "../actions";

interface AttendanceAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  currentRow?: StudentAttendance;
}

const formSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  checkIn: z.string().min(2, ""),
  checkOut: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AttendanceAddDialog({
  open,
  onOpenChange,
  currentRow,
  student,
}: AttendanceAddDialogProps) {
  const [isPending, startTransition] = useTransition();

  const isEdit = !!currentRow;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          date: currentRow.date,
          checkIn: currentRow?.checkIn
            ? format(currentRow.checkIn, "HH:mm")
            : "",
          checkOut: currentRow?.checkOut
            ? format(currentRow.checkOut, "HH:mm")
            : "",
        }
      : {
          date: new Date(),
          checkIn: "",
          checkOut: "",
        },
  });

  const onSubmit = async (data: FormValues) => {
    startTransition(async () => {
      try {
        let result;
        if (isEdit && currentRow) {
          result = await editAttendanceAction(currentRow.id, {
            ...data,
            id: currentRow.id,
          });
        } else {
          result = await createAttendanceAction(student.id, data);
        }

        if (result.success) {
          toast.success(result.message);
          onOpenChange(false);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to record attendance");
      }
    });
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit times</DialogTitle>
          <DialogDescription>
            {student.name} attendance for the given day. Note: this will change
            a student&apos;s checked-in status for today.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 pt-4"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 py-4">
              <div className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Check in</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="time"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Check out</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="time"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
