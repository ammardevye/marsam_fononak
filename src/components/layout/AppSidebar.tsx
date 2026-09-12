"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  Video,
  Brain,
  Target,
  FileBarChart,
  Image,
  FileText,
  HelpCircle,
  Sparkles,
  GitCompare,
  Activity,
  Bell,
  Settings,
  Shield,
} from "lucide-react";

const navigation = [
  {
    section: "الرئيسية",
    items: [
      { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
      { href: "/projects", label: "المشاريع", icon: FolderKanban },
      { href: "/tasks", label: "المهام", icon: CheckSquare },
    ],
  },
  {
    section: "التعاون",
    items: [
      { href: "/chat", label: "الدردشة", icon: MessageSquare },
      { href: "/meetings", label: "الاجتماعات", icon: Video },
    ],
  },
  {
    section: "مساحة الذكاء الاصطناعي",
    items: [
      { href: "/models", label: "نماذج الذكاء الاصطناعي", icon: Brain },
      { href: "/criteria", label: "معايير التقييم", icon: Target },
      { href: "/reports", label: "التقارير", icon: FileBarChart },
      { href: "/media", label: "الوسائط", icon: Image },
      { href: "/documents", label: "المستندات", icon: FileText },
      { href: "/questions", label: "الأسئلة", icon: HelpCircle },
      { href: "/nova-core", label: "NOVA Core", icon: Sparkles },
      { href: "/model-comparison", label: "مقارنة النماذج", icon: GitCompare },
    ],
  },
  {
    section: "النظام",
    items: [
      { href: "/activity", label: "سجل النشاطات", icon: Activity },
      { href: "/notifications", label: "الإشعارات", icon: Bell },
      { href: "/settings", label: "الإعدادات", icon: Settings },
      { href: "/admin", label: "الإدارة", icon: Shield },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-72 border-l border-border bg-surface transition-colors">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            N
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text">NOVA Hub</h1>
            <p className="text-xs text-text-muted">منصة العمل الاحترافية</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navigation.map((section) => (
            <div key={section.section} className="mb-6">
              <h3 className="mb-2 px-3 text-xs font-medium text-text-muted">{section.section}</h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-text hover:bg-hover"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-surface-secondary p-3">
            <p className="text-xs text-text-muted">NOVA Hub v1.0</p>
            <p className="text-xs text-text-muted">Phase 1 - UI Preview</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
