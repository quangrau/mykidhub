"use client";

import { signupAction } from "@/app/(auth)/sign-up/actions";
import { AlertDestructive } from "@/components/ui/alert-destructive";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userEmail: z.string().email("Invalid email address"),
  userPassword: z.string().min(6, "Password must be at least 6 characters"),
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  schoolPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  schoolCapacity: z.number().min(1, "Capacity must be at least 1"),
});

export function SignupForm() {
  // const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "Alex Le",
      userEmail: "admin@mykidhub.com",
      userPassword: "1234567890",
      schoolName: "My Kid Hub",
      schoolPhone: "1234567890",
      schoolCapacity: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Signup
      const result = await signupAction(values);

      if (!result.success) {
        console.error("Signup failed:", result.error);
        return;
      }

      console.log(result);

      // SignIn after signup successfully
      // const authResult = await signIn("credentials", {
      //   email: values.userEmail,
      //   password: values.userPassword,
      //   redirect: false,
      // });

      // if (!authResult?.ok) {
      //   form.setError("root", {
      //     type: "custom",
      //     message: authResult?.error ?? "Something went wrong",
      //   });
      //   return;
      // }

      // router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  function renderErrors() {
    if (!form.formState.errors.root) {
      return null;
    }

    return (
      <AlertDestructive
        title="Error"
        description={form.formState.errors.root.message}
      />
    );
  }

  return (
    <div className={"grid gap-6"}>
      {renderErrors()}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <Button
            className="w-full"
            type="submit"
            aria-disabled={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Create school
          </Button>
        </form>
      </Form>
    </div>
  );
}
