import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      {children}
    </main>
  );
}
