import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import AppShell from "@/components/layout/app-shell";
import { AuthProvider } from "@/context/auth-context";
import { getCurrentUser } from "@/lib/auth";

interface MainLayoutProps {
  children: ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AuthProvider initialUser={user}>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
