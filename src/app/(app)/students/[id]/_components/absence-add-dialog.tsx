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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@prisma/client";
import { createAbsenceAction } from "../actions";

interface AbsenceAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
}

const formSchema = z.object({
  date: z.date(),
  endDate: z.date().optional(),
  // startTime: z.string().optional(),
  // endTime: z.string().optional(),
  notes: z.string().optional(),
  createWeekends: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AbsenceAddDialog({
  open,
  onOpenChange,
  student,
}: AbsenceAddDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      endDate: undefined,
      notes: faker.lorem.sentence(),
      createWeekends: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    startTransition(async () => {
      try {
        const result = await createAbsenceAction(student.id, data);
        if (result.success) {
          toast.success(result.message);
          onOpenChange(false);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to record absence");
      }
    });
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record absence</DialogTitle>
          <DialogDescription>
            Partial day absences will remove scheduled time and show up on
            absence reports but will not mark the student &quot;Absent&quot;
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 pt-4"
          >
            <Tabs defaultValue="full" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger disabled value="partial">
                  Partial day
                </TabsTrigger>
                <TabsTrigger value="full">Full day</TabsTrigger>
                <TabsTrigger value="multiple">Multiple days</TabsTrigger>
              </TabsList>

              <TabsContent value="full" className="space-y-4">
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
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="multiple" className="space-y-4">
                <div className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                              // disabled={(date) =>
                              //   date > new Date() ||
                              //   date < new Date("1900-01-01")
                              // }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>End Date</FormLabel>
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
                              disabled={(date) => {
                                const fromDate = form.getValues("date");
                                return (
                                  date > new Date() ||
                                  date < new Date("1900-01-01") ||
                                  (fromDate && date < fromDate)
                                );
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="createWeekends"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>
                          Create absences for weekends if applicable
                        </FormLabel>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="accent-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Reason for absence"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              Record absence
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
