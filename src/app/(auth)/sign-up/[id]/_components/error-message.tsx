"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  type: "accepted" | "expired";
}

export function ErrorMessage({ type }: Props) {
  let title = "";
  let description = "";

  if (type === "accepted") {
    title = "This link has already been used.";
    description =
      "Please have an administrator send you another sign up link to create an account.";
  } else {
    title = "This link has expired.";
    description = "Please reach out to your child care center for a new link.";
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
