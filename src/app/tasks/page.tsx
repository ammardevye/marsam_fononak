"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/forms/Input";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { demoUsers } from "@/data/demoData";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { TaskFormDialog } from "@/components/features/tasks/TaskFormDialog";
import type { Task } from "@/types";

export default function TasksPage() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerQuery) ||
          t.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter) {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    if (projectFilter) {
      result = result.filter((t) => t.projectId === projectFilter);
    }

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter]);

  const handleCreateTask = (task: Omit<Task, "id">) => {
    createTask(task);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateTask = (updates: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, updates);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = () => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

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

  const statusColumns = [
    { id: "new", label: "جديد" },
    { id: "in-progress", label: "قيد التنفيذ" },
    { id: "review", label: "مراجعة" },
    { id: "blocked", label: "محظور" },
    { id: "completed", label: "مكتمل" },
    { id: "cancelled", label: "ملغى" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">المهام</h1>
            <p className="text-sm text-text-muted">إدارة وتتبع جميع المهام</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4 rotate-180" />مهمة جديدة
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Input
              type="search"
              placeholder="بحث عن مهمة..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">جميع الحالات</option>
              <option value="new">جديد</option>
              <option value="in-progress">قيد التنفيذ</option>
              <option value="review">مراجعة</option>
              <option value="blocked">محظور</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغى</option>
            </select>
            <select
              value={priorityFilter || ""}
              onChange={(e) => setPriorityFilter(e.target.value || null)}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">جميع الأولويات</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>
            <select
              value={projectFilter || ""}
              onChange={(e) => setProjectFilter(e.target.value || null)}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">جميع المشاريع</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.status === column.id);
            return (
              <div key={column.id} className="min-w-[280px] flex-1 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-surface-secondary px-3 py-2">
                  <h3 className="font-medium text-text">{column.label}</h3>
                  <Badge size="sm">{columnTasks.length}</Badge>
                </div>
                {columnTasks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-text-muted">
                    لا توجد مهام
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const assignee = demoUsers.find((u) => u.id === task.assigneeId);
                    return (
                      <Card key={task.id} className="cursor-pointer hover:shadow-md">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-text">{task.title}</h4>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTask(task);
                                }}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingTaskId(task.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-text-muted">{task.description}</p>
                          <div className="flex items-center justify-between text-xs text-text-muted">
                            <span>{project?.name}</span>
                            <span>{task.dueDate}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusBadgeVariant(task.status)} size="sm">
                                {getStatusLabel(task.status)}
                              </Badge>
                              <Badge
                                variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "secondary"}
                                size="sm"
                              >
                                {task.priority === "high" ? "عالي" : task.priority === "medium" ? "متوسط" : "منخفض"}
                              </Badge>
                            </div>
                            {assignee && <Avatar fallback={assignee.name.charAt(0)} size="sm" />}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>

        <TaskFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateTask}
          mode="create"
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        />

        <TaskFormDialog
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onSubmit={handleUpdateTask}
          initialData={editingTask || undefined}
          mode="edit"
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        />

        {deletingTaskId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-text mb-2">تأكيد الحذف</h3>
              <p className="text-text-muted mb-6">
                هل أنت متأكد من حذف هذه المهمة؟ هذه العملية محلية فقط في وضع العرض التوضيحي.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeletingTaskId(null)}>
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
