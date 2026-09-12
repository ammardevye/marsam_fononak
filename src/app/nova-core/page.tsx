"use client";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Plus } from "lucide-react";

export default function Page() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const pageName = path.split("/").pop() || "الصفحة";
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">{pageName}</h1>
            <p className="text-sm text-text-muted">صفحة {pageName} - Phase 1 UI Preview</p>
          </div>
          <Button><Plus className="ml-2 h-4 w-4 rotate-180" />إضافة جديد</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>مرحباً بك في صفحة {pageName}</CardTitle>
            <CardDescription>هذه الصفحة قيد التطوير - سيتم إضافة المحتوى الكامل في المرحلة التالية</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-muted">NOVA Hub - Phase 1: عرض واجهة المستخدم فقط</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
