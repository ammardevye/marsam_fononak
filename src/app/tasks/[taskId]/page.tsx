"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { demoUsers } from "@/data/demoData";
import { ArrowLeft, Edit, Trash2, Calendar, User, FolderOpen, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TaskFormDialog } from "@/components/features/tasks/TaskFormDialog";
import type { Task } from "@/types";
import { useState } from "react";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params?.taskId as string | undefined;
  
  const { tasks, updateTask, deleteTask } = useTasks();
  const { projects } = useProjects();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const task = tasks.find(t => t.id === taskId);
  const project = task ? projects.find(p => p.id === task.projectId) : null;
  const assignee = task?.assigneeId ? demoUsers.find(u => u.id === task.assigneeId) : null;
  const owner = project?.ownerId ? demoUsers.find(u => u.id === project.ownerId) : null;
  
  const handleDeleteTask = () => {
    if (taskId) {
      deleteTask(taskId);
      setShowDeleteConfirm(false);
    }
  };
  
  const handleUpdateTask = (updates: Partial<Task>) => {
    if (taskId) {
      updateTask(taskId, updates);
      setIsEditDialogOpen(false);
    }
  };
  
  if (!task) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold text-text mb-4">المهمة غير موجودة</h1>
          <p className="text-text-muted mb-6">عذراً، لا يمكن العثور على المهمة المطلوبة</p>
          <Link href="/tasks">
            <Button><ArrowLeft className="ml-2 h-4 w-4 rotate-180" />العودة للمهام</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  const getStatusBadgeVariant = (status: Task["status"]) => {
    switch (status) {
      case "completed": return "success";
      case "new": return "secondary";
      case "in-progress": return "info";
      case "review": return "warning";
      case "blocked": return "error";
      case "cancelled": return "secondary";
      default: return "secondary";
    }
  };
  
  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "completed": return "مكتمل";
      case "new": return "جديد";
      case "in-progress": return "قيد التنفيذ";
      case "review": return "مراجعة";
      case "blocked": return "محظور";
      case "cancelled": return "ملغى";
      default: return status;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link href="/tasks" className="hover:text-primary transition-colors">المهام</Link>
          <span>/</span>
          <span className="text-text">{task.title}</span>
        </div>
        
        {/* Task Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text">{task.title}</h1>
              <Badge variant={getStatusBadgeVariant(task.status)} size="sm">
                {getStatusLabel(task.status)}
              </Badge>
              <Badge variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "secondary"} size="sm">
                {task.priority === "high" ? "عالي" : task.priority === "medium" ? "متوسط" : "منخفض"}
              </Badge>
            </div>
            <p className="text-text-muted">{task.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="ml-2 h-4 w-4 rotate-180" />تعديل
            </Button>
            <Button variant="outline" size="sm" className="text-error border-error" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="ml-2 h-4 w-4 rotate-180" />حذف
            </Button>
          </div>
        </div>
        
        {/* Task Info Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary"><FolderOpen className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-text-muted">المشروع</p>
                <p className="font-medium text-text">{project?.name || "غير محدد"}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-info/10 text-info"><User className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-text-muted">المسؤول</p>
                <p className="font-medium text-text">{assignee?.name || "بدون مسؤول"}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10 text-warning"><Calendar className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-text-muted">تاريخ التسليم</p>
                <p className="font-medium text-text">{task.dueDate}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10 text-success"><CheckCircle className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-text-muted">التقدم</p>
                <p className="font-medium text-text">{task.progress}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed Info */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>حالة المهمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">الحالة</span>
                <Badge variant={getStatusBadgeVariant(task.status)}>{getStatusLabel(task.status)}</Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">الأولوية</span>
                <Badge variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "secondary"}>
                  {task.priority === "high" ? "عالي" : task.priority === "medium" ? "متوسط" : "منخفض"}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">التقدم</span>
                <span className="text-text">{task.progress}%</span>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-text-muted">نسبة الإنجاز</span>
                  <span className="font-medium text-text">{task.progress}%</span>
                </div>
                <div className="h-3 rounded-full bg-surface-secondary">
                  <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${task.progress}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل إضافية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">مالك المشروع</span>
                <span className="text-text">{owner?.name || "غير محدد"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">تاريخ التسليم</span>
                <span className="text-text">{task.dueDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">معرف المهمة</span>
                <span className="text-text font-mono text-sm">{task.id}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-muted">معرف المشروع</span>
                <span className="text-text font-mono text-sm">{task.projectId}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleUpdateTask({ status: "new" })}
                disabled={task.status === "new"}
              >
                <Clock className="ml-2 h-4 w-4 rotate-180" /> تعيين كجديدة
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleUpdateTask({ status: "in-progress" })}
                disabled={task.status === "in-progress"}
              >
                <Clock className="ml-2 h-4 w-4 rotate-180" /> بدء التنفيذ
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleUpdateTask({ status: "review" })}
                disabled={task.status === "review"}
              >
                <AlertCircle className="ml-2 h-4 w-4 rotate-180" /> إرسال للمراجعة
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleUpdateTask({ status: "completed" })}
                disabled={task.status === "completed"}
                className="text-success border-success"
              >
                <CheckCircle className="ml-2 h-4 w-4 rotate-180" /> إكمال المهمة
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleUpdateTask({ status: "blocked" })}
                disabled={task.status === "blocked"}
                className="text-error border-error"
              >
                <AlertCircle className="ml-2 h-4 w-4 rotate-180" /> حظر المهمة
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Edit Dialog */}
        <TaskFormDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => !open && setIsEditDialogOpen(false)}
          onSubmit={handleUpdateTask}
          initialData={task}
          mode="edit"
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        />
        
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-text mb-2">تأكيد الحذف</h3>
              <p className="text-text-muted mb-6">
                هل أنت متأكد من حذف هذه المهمة؟ هذه العملية محلية فقط في وضع العرض التوضيحي.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  إلغاء
                </Button>
                <Button variant="danger" onClick={handleDeleteTask}>
                  حذف
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
