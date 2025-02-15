"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import FormError from "@/components/form-error";
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
import { signUpSchema } from "@/lib/auth/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signupAction } from "../actions";

type SignUpData = z.infer<typeof signUpSchema>;

export function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "Alex Le",
      userEmail: "admin@mykidhub.com",
      userPassword: "1234567890",
      schoolName: "My Kid Hub",
      schoolPhone: "1234567890",
      schoolCapacity: 1,
    },
  });

  async function onSubmit(values: SignUpData) {
    startTransition(() => {
      signupAction(values)
        .then((result) => {
          if (!result.success) {
            form.setError("root", {
              type: "server",
              message: result.message,
            });
          } else {
            form.reset();

            toast.success("Your school has been created!", {
              description: "Please check your email for a verification link.",
              action: {
                label: "Sign In",
                onClick: () => router.push("/sign-in"),
              },
            });
          }
        })
        .catch((error) => {
          form.setError("root", {
            type: "custom",
            message: error?.message,
          });
        });
    });
  }

  return (
    <div className={"grid gap-6"}>
      <Form {...form}>
        <form
          autoComplete="off"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(XXX) XXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={form.formState.errors.root?.message} />

          <Button
            className="w-full"
            type="submit"
            aria-disabled={isPending}
            disabled={isPending}
          >
            Create school
          </Button>
        </form>
      </Form>
    </div>
  );
}
