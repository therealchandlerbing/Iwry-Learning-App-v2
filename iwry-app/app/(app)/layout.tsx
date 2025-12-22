import { auth } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation userName={session.user.name} />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
