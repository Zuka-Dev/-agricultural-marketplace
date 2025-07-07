import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface AdminRequiredProps {
  children: ReactNode;
}

export default async function AdminRequired({ children }: AdminRequiredProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "customer") {
    redirect("/");
  }

  return <>{children}</>;
}
