"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { demoProjects, demoMeetings, dashboardStats, demoActivities, demoUsers } from "@/data/demoData";
import { TrendingUp, FolderOpen, CheckCircle, Clock, Calendar, Plus } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "المشاريع النشطة", value: dashboardStats.activeProjects, icon: FolderOpen, color: "text-primary" },
    { label: "المشاريع المكتملة", value: dashboardStats.completedProjects, icon: CheckCircle, color: "text-success" },
    { label: "إجمالي المهام", value: dashboardStats.totalTasks, icon: TrendingUp, color: "text-info" },
    { label: "المهام المعلقة", value: dashboardStats.pendingTasks, icon: Clock, color: "text-warning" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">لوحة التحكم</h1>
            <p className="text-sm text-text-muted">نظرة عامة على مساحة العمل</p>
          </div>
          <Button><Plus className="ml-2 h-4 w-4 rotate-180" />مشروع جديد</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-muted">{stat.label}</p>
                      <p className="mt-1 text-3xl font-bold text-text">{stat.value}</p>
                    </div>
                    <Icon className={`h-10 w-10 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>آخر المشاريع</CardTitle><CardDescription>المشاريع الحديثة والنشطة</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoProjects.slice(0, 4).map((project) => (
                  <div key={project.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">{project.name.charAt(0)}</div>
                      <div>
                        <h3 className="font-medium text-text">{project.name}</h3>
                        <p className="text-sm text-text-muted">{project.taskCount} مهمة</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={project.status === "completed" ? "success" : project.status === "active" ? "info" : project.status === "on-hold" ? "warning" : "secondary"}>
                        {project.status === "completed" ? "مكتمل" : project.status === "active" ? "نشط" : project.status === "on-hold" ? "مؤجل" : "تخطيط"}
                      </Badge>
                      <div className="w-24">
                        <div className="mb-1 text-xs text-text-muted">{project.progress}%</div>
                        <div className="h-2 rounded-full bg-surface-secondary"><div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }} /></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>الاجتماعات القادمة</CardTitle><CardDescription>مواعيد الاجتماعات القريبة</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoMeetings.filter(m => m.status === "upcoming").slice(0, 3).map((meeting) => (
                  <div key={meeting.id} className="rounded-lg border border-border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium text-text">{meeting.title}</h3>
                      <Badge variant="outline">{meeting.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{meeting.date}</span>
                      <span>{meeting.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>سجل النشاطات الأخير</CardTitle><CardDescription>آخر العمليات في المنصة</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoActivities.slice(0, 5).map((activity) => {
                const user = demoUsers.find(u => u.id === activity.userId);
                return (
                  <div key={activity.id} className="flex items-start gap-4">
                    <Avatar fallback={user?.name.charAt(0) || "?"} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm text-text"><span className="font-medium">{user?.name}</span> {activity.action} <span className="font-medium">{activity.entity}</span></p>
                      <p className="text-xs text-text-muted">{new Date(activity.timestamp).toLocaleString("ar-SA")}</p>
                    </div>
                    <Badge variant="secondary" size="sm">{activity.entityType}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
