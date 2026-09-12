import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-surface-secondary p-6">
      <div className="text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-4xl font-bold text-primary-foreground shadow-lg">
          N
        </div>
        <h1 className="mb-4 text-4xl font-bold text-text sm:text-5xl">NOVA Hub</h1>
        <p className="mb-8 max-w-md text-lg text-text-muted">
          منصة العمل الاحترافية الشاملة لإدارة المشاريع والمهام والتعاون الفريقي
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              الدخول إلى المنصة
            </Button>
          </Link>
        </div>
        <p className="mt-8 text-sm text-text-muted">
          Phase 1 - عرض واجهة المستخدم فقط
        </p>
      </div>
    </div>
  );
}
