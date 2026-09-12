"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/overlays/Dialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/forms/Input";
import type { Task } from "@/types";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: Omit<Task, "id">) => void;
  initialData?: Partial<Task>;
  mode: "create" | "edit";
  projects: Array<{ id: string; name: string }>;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
  projects,
}: TaskFormDialogProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [projectId, setProjectId] = useState(initialData?.projectId || "");
  const [status, setStatus] = useState<Task["status"]>(initialData?.status || "new");
  const [priority, setPriority] = useState<Task["priority"]>(initialData?.priority || "medium");
  const [assigneeId, setAssigneeId] = useState<string>(initialData?.assigneeId || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [progress, setProgress] = useState(initialData?.progress || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "عنوان المهمة مطلوب";
    }
    
    if (!projectId) {
      newErrors.projectId = "المشروع مطلوب";
    }
    
    if (!dueDate) {
      newErrors.dueDate = "تاريخ التسليم مطلوب";
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
      title,
      description,
      projectId,
      status,
      priority,
      assigneeId: assigneeId || null,
      dueDate,
      progress,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setProjectId("");
    setStatus("new");
    setPriority("medium");
    setAssigneeId("");
    setDueDate("");
    setProgress(0);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "إنشاء مهمة جديدة" : "تعديل المهمة"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "أدخل تفاصيل المهمة الجديدة. التغييرات محلية فقط في وضع العرض التوضيحي." 
              : "تعديل تفاصيل المهمة. التغييرات محلية فقط في وضع العرض التوضيحي."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              عنوان المهمة <span className="text-error">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان المهمة"
              className={errors.title ? "border-error" : ""}
            />
            {errors.title && <p className="text-xs text-error">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              الوصف
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف المهمة"
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="projectId" className="text-sm font-medium">
                المشروع <span className="text-error">*</span>
              </label>
              <select
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.projectId ? "border-error" : ""}`}
              >
                <option value="">اختر المشروع</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.projectId && <p className="text-xs text-error">{errors.projectId}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="assigneeId" className="text-sm font-medium">
                المسؤول
              </label>
              <select
                id="assigneeId"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">بدون مسؤول</option>
                <option value="u1">أحمد محمد</option>
                <option value="u2">فاطمة علي</option>
                <option value="u3">محمد حسن</option>
                <option value="u4">سارة أحمد</option>
                <option value="u5">خالد إبراهيم</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                الحالة
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="new">جديد</option>
                <option value="in-progress">قيد التنفيذ</option>
                <option value="review">مراجعة</option>
                <option value="blocked">محظور</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                الأولوية
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="progress" className="text-sm font-medium">
                التقدم ({progress}%)
              </label>
              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full"
              />
            </div>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">
              {mode === "create" ? "إنشاء المهمة" : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
