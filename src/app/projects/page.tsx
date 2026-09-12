"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/forms/Input";
import { useProjects } from "@/hooks/useProjects";
import { demoUsers } from "@/data/demoData";
import { Plus, Search, Filter, Grid, List, Pencil, Trash2 } from "lucide-react";
import { ProjectFormDialog } from "@/components/features/projects/ProjectFormDialog";
import { sortProjects } from "@/lib/localStore";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const { projects, createProject, updateProject, deleteProject, resetToDemo } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "dueDate" | "lastUpdated" | "priority">("lastUpdated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Sort using shared utility
    result = sortProjects(result, sortBy, sortOrder);

    return result;
  }, [projects, searchQuery, statusFilter, sortBy, sortOrder]);

  const handleCreateProject = (project: Omit<Project, "id" | "lastUpdated">) => {
    createProject(project);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateProject = (updates: Partial<Project>) => {
    if (editingProject) {
      updateProject(editingProject.id, updates);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = () => {
    if (deletingProjectId) {
      deleteProject(deletingProjectId);
      setDeletingProjectId(null);
    }
  };

  const getStatusBadgeVariant = (status: Project["status"]) => {
    switch (status) {
      case "completed": return "success";
      case "active": return "info";
      case "on-hold": return "warning";
      case "planning": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: Project["status"]) => {
    switch (status) {
      case "completed": return "مكتمل";
      case "active": return "نشط";
      case "on-hold": return "مؤجل";
      case "planning": return "تخطيط";
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-text">المشاريع</h1>
            <p className="text-sm text-text-muted">إدارة وتتبع جميع المشاريع</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("هل أنت متأكد من إعادة تعيين البيانات التوضيحية؟ سيتم فقدان جميع التغييرات المحلية.")) {
                  resetToDemo();
                }
              }}
              className="text-xs"
            >
              إعادة تعيين البيانات
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="ml-2 h-4 w-4 rotate-180" />مشروع جديد
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <Input
              type="search"
              placeholder="بحث عن مشروع..."
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
              aria-label="تصفية حسب الحالة"
            >
              <option value="">جميع الحالات</option>
              <option value="planning">تخطيط</option>
              <option value="active">نشط</option>
              <option value="on-hold">مؤجل</option>
              <option value="completed">مكتمل</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="ترتيب حسب"
            >
              <option value="lastUpdated">آخر تحديث</option>
              <option value="name">الاسم</option>
              <option value="dueDate">تاريخ التسليم</option>
              <option value="priority">الأولوية</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="اتجاه الترتيب"
            >
              <option value="desc">تنازلي</option>
              <option value="asc">تصاعدي</option>
            </select>
            <Button variant="outline" size="icon" onClick={() => setViewMode("grid")} aria-label="عرض شبكي">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setViewMode("list")} aria-label="عرض قائمة">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-text-muted">لا توجد مشاريع مطابقة للبحث</p>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const owner = demoUsers.find((u) => u.id === project.ownerId);
              return (
                <Card key={project.id} className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                        {project.name.charAt(0)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-error"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingProjectId(project.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-text-muted">{project.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-text-muted">
                        <span>التقدم</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span>{project.completedTasks}/{project.taskCount} مهمة</span>
                      <span>تسليم: {project.dueDate}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex -space-x-2 space-x-reverse">
                        {project.memberIds.slice(0, 3).map((id) => {
                          const user = demoUsers.find((u) => u.id === id);
                          return (
                            <Avatar
                              key={id}
                              fallback={user?.name.charAt(0) || "?"}
                              size="sm"
                            />
                          );
                        })}
                      </div>
                      <Avatar fallback={owner?.name.charAt(0) || "?"} size="sm" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-text-muted">المشروع</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-text-muted">الحالة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-text-muted">التقدم</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-text-muted">المهام</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-text-muted">تاريخ التسليم</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => {
                    const owner = demoUsers.find((u) => u.id === project.ownerId);
                    return (
                      <tr key={project.id} className="border-t border-border">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                              {project.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-text">{project.name}</p>
                              <p className="text-xs text-text-muted">{owner?.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getStatusBadgeVariant(project.status)}>
                            {getStatusLabel(project.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 rounded-full bg-surface-secondary">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-text-muted">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-muted">
                          {project.completedTasks}/{project.taskCount}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-muted">{project.dueDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingProject(project)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-error"
                              onClick={() => setDeletingProjectId(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Create Project Dialog */}
        <ProjectFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateProject}
          mode="create"
        />

        {/* Edit Project Dialog */}
        <ProjectFormDialog
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
          onSubmit={handleUpdateProject}
          initialData={editingProject || undefined}
          mode="edit"
        />

        {/* Delete Confirmation Dialog */}
        {deletingProjectId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-text mb-2">تأكيد الحذف</h3>
              <p className="text-text-muted mb-6">
                هل أنت متأكد من حذف هذا المشروع؟ سيتم حذف جميع المهام المرتبطة به.
                هذه العملية محلية فقط في وضع العرض التوضيحي.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeletingProjectId(null)}>
                  إلغاء
                </Button>
                <Button variant="danger" onClick={handleDeleteProject}>
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
