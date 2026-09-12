"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/forms/Input";
import { demoProjects, demoUsers } from "@/data/demoData";
import { Plus, Search, Filter, Grid, List } from "lucide-react";

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">المشاريع</h1>
            <p className="text-sm text-text-muted">إدارة وتتبع جميع المشاريع</p>
          </div>
          <Button><Plus className="ml-2 h-4 w-4 rotate-180" />مشروع جديد</Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <Input type="search" placeholder="بحث عن مشروع..." icon={<Search className="h-4 w-4" />} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Filter className="ml-2 h-4 w-4 rotate-180" />تصفية</Button>
            <Button variant="outline" size="icon"><Grid className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><List className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoProjects.map((project) => {
            const owner = demoUsers.find(u => u.id === project.ownerId);
            return (
              <Card key={project.id} className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">{project.name.charAt(0)}</div>
                    <Badge variant={project.status === "completed" ? "success" : project.status === "active" ? "info" : project.status === "on-hold" ? "warning" : "secondary"}>
                      {project.status === "completed" ? "مكتمل" : project.status === "active" ? "نشط" : project.status === "on-hold" ? "مؤجل" : "تخطيط"}
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
                    <div className="h-2 rounded-full bg-surface-secondary"><div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }} /></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-text-muted">
                    <span>{project.completedTasks}/{project.taskCount} مهمة</span>
                    <span>تسليم: {project.dueDate}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex -space-x-2 space-x-reverse">
                      {project.memberIds.slice(0, 3).map(id => {
                        const user = demoUsers.find(u => u.id === id);
                        return <Avatar key={id} fallback={user?.name.charAt(0) || "?"} size="sm" />;
                      })}
                    </div>
                    <Avatar fallback={owner?.name.charAt(0) || "?"} size="sm" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
