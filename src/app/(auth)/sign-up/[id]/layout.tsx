import { GalleryVerticalEnd } from "lucide-react";

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm md:max-w-lg flex-col gap-6">
        <header className="flex items-center justify-center">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            MyKidHub
          </a>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
