"use client";

import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAccountFormSchema } from "@/lib/auth/auth.schema";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Organization } from "@prisma/client";

import { createAccountAction } from "../../actions";

interface Props {
  email: string;
  name?: string | null;
  phone?: string | null;
  organization: Pick<Organization, "id" | "name">;
  invitationId: string;
}

export function CreateAccountForm({
  name,
  email,
  // phone,
  organization,
  invitationId,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const mockPassword = "1234567890";
  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      email,
      name: name || faker.person.fullName(),
      // phone: phone || faker.phone.number(),
      password: mockPassword,
      confirmPassword: mockPassword,
      invitationId: invitationId,
      organizationId: organization.id,
    },
  });

  async function onSubmit(values: z.infer<typeof createAccountFormSchema>) {
    startTransition(async () => {
      const result = await createAccountAction(values);

      if (!result.success) {
        form.setError("root", {
          type: "server",
          message: result.message,
        });
      } else {
        form.reset();

        toast.success("Your account has been created!", {
          description: "Please sign-in to your account.",
          action: {
            label: "Sign In",
            onClick: () => router.push("/sign-in"),
          },
        });
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Join {organization.name} by creating your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your name *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            autoComplete="name"
                            placeholder="Enter your name"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      disabled
                      autoComplete="off"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      className="pl-10"
                    />
                  </div>
                </FormItem>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            autoComplete="new-password"
                            placeholder="Enter your password"
                            type="password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            autoComplete="new-password"
                            placeholder="Confirm your password"
                            type="password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                By creating an account, you are agreeing to MyKidHub&apos;s{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full"
                aria-disabled={isPending}
                disabled={isPending}
              >
                {isPending ? "Creating acount..." : "Create account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
