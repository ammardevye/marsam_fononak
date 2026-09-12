"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { demoProjects, demoTasks, demoUsers, demoActivities } from "@/data/demoData";
import { ArrowLeft, Calendar, CheckCircle, Clock, Edit, FolderOpen, Archive, MoreHorizontal, Plus, Search, Filter, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params?.projectId as string | undefined;
  
  const project = demoProjects.find(p => p.id === projectId);
  const projectTasks = demoTasks.filter(t => t.projectId === projectId);
  const owner = project?.ownerId ? demoUsers.find(u => u.id === project.ownerId) : null;
  const members = project?.memberIds.map(id => demoUsers.find(u => u.id === id)).filter(Boolean) as typeof demoUsers;
  
  // Task statistics for this project
  const taskStats = {
    total: projectTasks.length,
    completed: projectTasks.filter(t => t.status === "completed").length,
    inProgress: projectTasks.filter(t => t.status === "in-progress" || t.status === "review").length,
    new: projectTasks.filter(t => t.status === "new").length,
    blocked: projectTasks.filter(t => t.status === "blocked" || t.status === "cancelled").length,
  };
  
  // Recent activity (demo - filtered by project name)
  const recentActivity = demoActivities.slice(0, 5);
  
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
                <input
                  type="search"
                  placeholder="بحث عن مهمة..."
                  className="w-full h-9 pr-9 pl-3 rounded-md border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-text-muted" />
              </div>
              <Button variant="outline" size="sm"><Filter className="h-4 w-4" /></Button>
              <Button size="sm"><Plus className="ml-2 h-4 w-4 rotate-180" />مهمة</Button>
            </div>
          </CardHeader>
          <CardContent>
            {projectTasks.length === 0 ? (
              <div className="py-8 text-center text-text-muted">لا توجد مهام في هذا المشروع بعد</div>
            ) : (
              <div className="space-y-2">
                {projectTasks.map((task) => {
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
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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
      </div>
    </DashboardLayout>
  );
}
