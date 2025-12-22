"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Home, MessageCircle, AlertCircle, User, LogOut } from "lucide-react";

export default function Navigation({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/practice", label: "Practice", icon: MessageCircle },
    { href: "/corrections", label: "Corrections", icon: AlertCircle },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="border-b border-border bg-[#0f1419]/90 backdrop-blur-xl sticky top-0 z-40 hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#00d9ff] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm glow-cyan-sm group-hover:glow-cyan transition-all duration-300">
                  I
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Iwry</span>
                <span className="text-[10px] text-muted-foreground -mt-1">Fala Conmigo</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/30 glow-cyan-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-[#1e2433]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] flex items-center justify-center text-white text-xs font-bold glow-purple-sm">
                  {userName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-foreground">
                  {userName || "User"}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Header */}
      <header className="border-b border-border bg-[#0f1419]/90 backdrop-blur-xl sticky top-0 z-40 md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#00d9ff] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm glow-cyan-sm">
                I
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Iwry</span>
                <span className="text-[10px] text-muted-foreground -mt-1">Fala Conmigo</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] flex items-center justify-center text-white text-xs font-bold glow-purple-sm">
                {userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-[#0f1419]/95 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 ${
                isActive(item.href)
                  ? "text-[#00d9ff] bg-[#00d9ff]/10"
                  : "text-muted-foreground"
              }`}
            >
              <div className={`relative ${isActive(item.href) ? "glow-cyan-sm" : ""}`}>
                <item.icon className={`h-5 w-5 ${isActive(item.href) ? "stroke-2" : ""}`} />
              </div>
              <span>{item.label}</span>
              {isActive(item.href) && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#00d9ff] rounded-full glow-cyan-sm" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
