import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/chat");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      {children}
    </main>
  );
}
