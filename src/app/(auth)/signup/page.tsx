import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your school
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill out your information to create a new school
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
