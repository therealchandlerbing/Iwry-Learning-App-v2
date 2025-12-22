import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  glowClass?: string;
  href?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  glowClass = "",
  href,
}: StatCardProps) {
  const content = (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      </div>
      <div
        className={`h-10 w-10 rounded-lg border ${color} flex items-center justify-center transition-all duration-300 ${glowClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group rounded-xl border border-border bg-[#1e2433] p-4 hover:border-border-glow transition-all duration-300"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-[#1e2433] p-4">
      {content}
    </div>
  );
}
