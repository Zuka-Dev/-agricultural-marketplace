import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface LoginRequiredProps {
  children: ReactNode;
}

export default async function LoginRequired({ children }: LoginRequiredProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
