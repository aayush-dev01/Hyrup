import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { resolvePostAuthRoute } from "@/lib/auth-routing";

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      learnerProfile: true,
      teacherProfile: true,
    },
  });

  if (!user) {
    redirect("/auth/post-auth");
  }

  const nextPath = resolvePostAuthRoute(user);
  if (nextPath === "/dashboard" || nextPath === "/teacher-dashboard") {
    // First-login-only guard: if onboarding is done, never show onboarding again.
    redirect(nextPath);
  }

  return <>{children}</>;
}

