// Purpose: Post-auth redirect that ensures DB user exists, then routes based on onboarding state.
// Prereq: Clerk auth must be configured; Prisma `User.imageUrl` stores Clerk imageUrl.
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

function normalizeEmail(email: string | null | undefined, userId: string) {
  return email ?? `temp-${userId}@example.com`;
}

export default async function PostAuthPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const email = normalizeEmail(clerkUser.emailAddresses?.[0]?.emailAddress, userId);
  const firstName = clerkUser.firstName ?? "";
  const lastName = clerkUser.lastName ?? "";
  const imageUrl = clerkUser.imageUrl ?? null;

  // Ensure we always have a DB record after auth.
  await db.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email,
      firstName,
      lastName,
      imageUrl,
    },
    update: {
      email,
      firstName,
      lastName,
      imageUrl,
    },
  });

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      learnerProfile: true,
      teacherProfile: true,
    },
  });

  if (!user) redirect("/onboarding");

  // If role hasn't been picked yet (no profile rows), do the lightweight role selection once.
  if (!user.learnerProfile && !user.teacherProfile) {
    redirect("/onboarding");
  }

  if (user.role === "TEACHER") {
    const needsSetup = !user.teacherProfile || !user.teacherProfile.bio?.trim() || Number(user.teacherProfile.hourlyRate) <= 0;
    redirect(needsSetup ? "/onboarding/teacher-setup" : "/teacher-dashboard");
  }

  // LEARNER
  const needsSetup = !user.learnerProfile || !user.learnerProfile.goals?.trim();
  redirect(needsSetup ? "/onboarding/learner-setup" : "/dashboard");
}

