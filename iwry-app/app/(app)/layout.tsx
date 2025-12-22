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
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <Navigation userName={session.user.name} />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
