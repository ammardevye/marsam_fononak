"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/overlays/Dialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/forms/Input";
import type { Project } from "@/types";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (project: Omit<Project, "id" | "lastUpdated">) => void;
  initialData?: Partial<Project>;
  mode: "create" | "edit";
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: ProjectFormDialogProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<Project["status"]>(initialData?.status || "planning");
  const [priority, setPriority] = useState<Project["priority"]>(initialData?.priority || "medium");
  const [ownerId, setOwnerId] = useState(initialData?.ownerId || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "اسم المشروع مطلوب";
    }
    
    if (!ownerId) {
      newErrors.ownerId = "المالك مطلوب";
    }
    
    if (!startDate) {
      newErrors.startDate = "تاريخ البدء مطلوب";
    }
    
    if (!dueDate) {
      newErrors.dueDate = "تاريخ التسليم مطلوب";
    } else if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
      newErrors.dueDate = "تاريخ التسليم يجب أن يكون بعد تاريخ البدء";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    onSubmit({
      name,
      description,
      status,
      priority,
      ownerId,
      memberIds: initialData?.memberIds || [],
      taskCount: initialData?.taskCount || 0,
      completedTasks: initialData?.completedTasks || 0,
      progress: initialData?.progress || 0,
      startDate,
      dueDate,
    });

    // Reset form after successful submission
    setName("");
    setDescription("");
    setStatus("planning");
    setPriority("medium");
    setOwnerId("");
    setStartDate("");
    setDueDate("");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "إنشاء مشروع جديد" : "تعديل المشروع"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "أدخل تفاصيل المشروع الجديد. التغييرات محلية فقط في وضع العرض التوضيحي." 
              : "تعديل تفاصيل المشروع. التغييرات محلية فقط في وضع العرض التوضيحي."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                اسم المشروع <span className="text-error">*</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسم المشروع"
                className={errors.name ? "border-error" : ""}
              />
              {errors.name && <p className="text-xs text-error">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="ownerId" className="text-sm font-medium">
                المالك <span className="text-error">*</span>
              </label>
              <select
                id="ownerId"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.ownerId ? "border-error" : ""}`}
              >
                <option value="">اختر المالك</option>
                <option value="u1">أحمد محمد</option>
                <option value="u2">فاطمة علي</option>
                <option value="u3">محمد حسن</option>
                <option value="u4">سارة أحمد</option>
                <option value="u5">خالد إبراهيم</option>
              </select>
              {errors.ownerId && <p className="text-xs text-error">{errors.ownerId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              الوصف
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف المشروع"
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                الحالة
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Project["status"])}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="planning">تخطيط</option>
                <option value="active">نشط</option>
                <option value="on-hold">مؤجل</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                الأولوية
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Project["priority"])}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                تاريخ البدء <span className="text-error">*</span>
              </label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={errors.startDate ? "border-error" : ""}
              />
              {errors.startDate && <p className="text-xs text-error">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                تاريخ التسليم <span className="text-error">*</span>
              </label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={errors.dueDate ? "border-error" : ""}
              />
              {errors.dueDate && <p className="text-xs text-error">{errors.dueDate}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">
              {mode === "create" ? "إنشاء المشروع" : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
