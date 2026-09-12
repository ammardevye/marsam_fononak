"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/forms/Input";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { demoUsers, demoActivities } from "@/data/demoData";
import { ArrowLeft, Calendar, CheckCircle, Clock, Edit, FolderOpen, Archive, MoreHorizontal, Plus, Search, Filter, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TaskFormDialog } from "@/components/features/tasks/TaskFormDialog";
import type { Task, Project } from "@/types";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params?.projectId as string | undefined;
  
  const { projects, updateProject } = useProjects();
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  
  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const owner = project?.ownerId ? demoUsers.find(u => u.id === project.ownerId) : null;
  const members = project?.memberIds.map(id => demoUsers.find(u => u.id === id)).filter(Boolean) as typeof demoUsers;
  
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Task statistics for this project - calculated from current data
  const taskStats = useMemo(() => ({
    total: projectTasks.length,
    completed: projectTasks.filter(t => t.status === "completed").length,
    inProgress: projectTasks.filter(t => t.status === "in-progress" || t.status === "review").length,
    new: projectTasks.filter(t => t.status === "new").length,
    blocked: projectTasks.filter(t => t.status === "blocked" || t.status === "cancelled").length,
  }), [projectTasks]);
  
  // Filter tasks based on search and status
  const filteredProjectTasks = useMemo(() => {
    let result = [...projectTasks];
    
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
    
    return result;
  }, [projectTasks, searchQuery, statusFilter]);
  
  // Recent activity (demo - static for now)
  const recentActivity = demoActivities.slice(0, 5);
  
  const handleCreateTask = (task: Omit<Task, "id">) => {
    createTask(task);
    setIsCreateTaskDialogOpen(false);
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
  
  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold text-text mb-4">المشروع غير موجود</h1>
          <p className="text-text-muted mb-6">عذراً، لا يمكن العثور على المشروع المطلوب</p>
          <Link href="/projects">
            <Button><ArrowLeft className="ml-2 h-4 w-4 rotate-180" />العودة للمشاريع</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link href="/projects" className="hover:text-primary transition-colors">المشاريع</Link>
          <span>/</span>
          <span className="text-text">{project.name}</span>
        </div>
        
        {/* Project Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text">{project.name}</h1>
              <Badge variant={project.status === "completed" ? "success" : project.status === "active" ? "info" : project.status === "on-hold" ? "warning" : "secondary"}>
                {project.status === "completed" ? "مكتمل" : project.status === "active" ? "نشط" : project.status === "on-hold" ? "مؤجل" : "تخطيط"}
              </Badge>
              <Badge variant={project.priority === "high" ? "error" : project.priority === "medium" ? "warning" : "secondary"} size="sm">
                {project.priority === "high" ? "عالي" : project.priority === "medium" ? "متوسط" : "منخفض"}
              </Badge>
            </div>
            <p className="text-text-muted">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Edit className="ml-2 h-4 w-4 rotate-180" />تعديل</Button>
            <Button variant="outline" size="sm" className="text-warning border-warning"><Archive className="ml-2 h-4 w-4 rotate-180" />أرشفة</Button>
          </div>
        </div>
        
        {/* Project Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary"><FolderOpen className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-text-muted">إجمالي المهام</p>
                <p className="text-2xl font-bold text-text">{taskStats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10 text-success"><CheckCircle className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-text-muted">مكتملة</p>
                <p className="text-2xl font-bold text-text">{taskStats.completed}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-info/10 text-info"><Clock className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-text-muted">قيد التنفيذ</p>
                <p className="text-2xl font-bold text-text">{taskStats.inProgress}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10 text-warning"><Calendar className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-text-muted">تاريخ التسليم</p>
                <p className="text-lg font-semibold text-text">{project.dueDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Progress & Team */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>التقدم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-text-muted">نسبة الإنجاز</span>
                  <span className="font-medium text-text">{project.progress}%</span>
                </div>
                <div className="h-3 rounded-full bg-surface-secondary">
                  <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-sm text-text-muted pt-2">
                <span>البداية: {project.startDate}</span>
                <span>النهاية: {project.dueDate}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>فريق العمل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-sm text-text-muted">مالك المشروع:</div>
                {owner && (
                  <div className="flex items-center gap-2">
                    <Avatar fallback={owner.name.charAt(0)} size="md" />
                    <span className="font-medium text-text">{owner.name}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm text-text-muted mb-2">الأعضاء ({members.length})</div>
                <div className="flex -space-x-2 space-x-reverse">
                  {members.map(member => (
                    <Avatar key={member.id} fallback={member.name.charAt(0)} size="md" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع المهام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 rounded-lg bg-surface-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm text-text-muted">جديدة</span>
                </div>
                <p className="text-2xl font-bold text-text">{taskStats.new}</p>
              </div>
              <div className="p-4 rounded-lg bg-surface-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-info" />
                  <span className="text-sm text-text-muted">قيد التنفيذ</span>
                </div>
                <p className="text-2xl font-bold text-text">{taskStats.inProgress}</p>
              </div>
              <div className="p-4 rounded-lg bg-surface-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-text-muted">مكتملة</span>
                </div>
                <p className="text-2xl font-bold text-text">{taskStats.completed}</p>
              </div>
              <div className="p-4 rounded-lg bg-surface-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <span className="text-sm text-text-muted">محظورة/ملغاة</span>
                </div>
                <p className="text-2xl font-bold text-text">{taskStats.blocked}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tasks List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>مهام المشروع</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Input
                  type="search"
                  placeholder="بحث عن مهمة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-text-muted" />
              </div>
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
              <Button size="sm" onClick={() => setIsCreateTaskDialogOpen(true)}>
                <Plus className="ml-2 h-4 w-4 rotate-180" />مهمة
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProjectTasks.length === 0 ? (
              <div className="py-8 text-center text-text-muted">
                {projectTasks.length === 0 
                  ? "لا توجد مهام في هذا المشروع بعد" 
                  : "لا توجد مهام مطابقة للبحث"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProjectTasks.map((task) => {
                  const assignee = task.assigneeId ? demoUsers.find(u => u.id === task.assigneeId) : null;
                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-secondary transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-2 h-2 rounded-full ${task.status === "completed" ? "bg-success" : task.status === "in-progress" ? "bg-info" : task.status === "review" ? "bg-warning" : task.status === "blocked" ? "bg-error" : "bg-secondary"}`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-text">{task.title}</h4>
                          <p className="text-sm text-text-muted">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "secondary"} size="sm">
                          {task.priority === "high" ? "عالي" : task.priority === "medium" ? "متوسط" : "منخفض"}
                        </Badge>
                        <Badge variant={task.status === "completed" ? "success" : task.status === "in-progress" ? "info" : task.status === "review" ? "warning" : task.status === "blocked" ? "error" : "secondary"} size="sm">
                          {task.status === "completed" ? "مكتمل" : task.status === "in-progress" ? "قيد التنفيذ" : task.status === "review" ? "مراجعة" : task.status === "blocked" ? "محظور" : task.status === "cancelled" ? "ملغى" : "جديد"}
                        </Badge>
                        <span className="text-sm text-text-muted">{task.dueDate}</span>
                        {assignee && <Avatar fallback={assignee.name.charAt(0)} size="sm" />}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingTask(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-error"
                            onClick={() => setDeletingTaskId(task.id)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>النشاط الأخير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const user = demoUsers.find(u => u.id === activity.userId);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <Avatar fallback={user?.name.charAt(0) || "?"} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm text-text">
                        <span className="font-medium">{user?.name}</span>
                        {" "}{activity.action}{" "}
                        <span className="font-medium">{activity.entity}</span>
                      </p>
                      <p className="text-xs text-text-muted">{new Date(activity.timestamp).toLocaleString("ar-SA")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs Placeholder */}
        <div className="border-t border-border pt-6">
          <div className="flex gap-2 border-b border-border">
            <button className="px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary">نظرة عامة</button>
            <button className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text">المهام</button>
            <button className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text">الأعضاء</button>
            <button className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text">الملفات</button>
            <button className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text">الاجتماعات</button>
            <button className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text">النشاط</button>
          </div>
          <div className="py-8 text-center text-text-muted">
            <p>ميزات إضافية قادمة في مراحل لاحقة</p>
          </div>
        </div>
        
        {/* Task Create/Edit Dialog */}
        <TaskFormDialog
          open={isCreateTaskDialogOpen}
          onOpenChange={setIsCreateTaskDialogOpen}
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
        
        {/* Delete Confirmation Dialog */}
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
