"use client";
import CombinedAuthForm from "components/CombinedAuthForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return (
    <main>
      <CombinedAuthForm />
    </main>
  );
}
