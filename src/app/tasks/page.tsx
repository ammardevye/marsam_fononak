"use client";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/forms/Input";
import { demoTasks, demoProjects, demoUsers } from "@/data/demoData";
import { Plus, Search, Filter } from "lucide-react";

export default function TasksPage() {
  const statusColumns = [
    { id: "new", label: "جديد", color: "bg-secondary" },
    { id: "in-progress", label: "قيد التنفيذ", color: "bg-info" },
    { id: "review", label: "مراجعة", color: "bg-warning" },
    { id: "completed", label: "مكتمل", color: "bg-success" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-text">المهام</h1><p className="text-sm text-text-muted">إدارة وتتبع جميع المهام</p></div>
          <Button><Plus className="ml-2 h-4 w-4 rotate-180" />مهمة جديدة</Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1"><Input type="search" placeholder="بحث عن مهمة..." icon={<Search className="h-4 w-4" />} /></div>
          <Button variant="outline"><Filter className="ml-2 h-4 w-4 rotate-180" />تصفية</Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map((column) => {
            const columnTasks = demoTasks.filter(t => t.status === column.id);
            return (
              <div key={column.id} className="min-w-[280px] flex-1 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-surface-secondary px-3 py-2"><h3 className="font-medium text-text">{column.label}</h3><Badge size="sm">{columnTasks.length}</Badge></div>
                {columnTasks.map((task) => {
                  const project = demoProjects.find(p => p.id === task.projectId);
                  const assignee = demoUsers.find(u => u.id === task.assigneeId);
                  return (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between"><h4 className="font-medium text-text">{task.title}</h4><Badge variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "secondary"} size="sm">{task.priority === "high" ? "عالي" : task.priority === "medium" ? "متوسط" : "منخفض"}</Badge></div>
                        <p className="text-sm text-text-muted">{task.description}</p>
                        <div className="flex items-center justify-between text-xs text-text-muted"><span>{project?.name}</span><span>{task.dueDate}</span></div>
                        <div className="flex items-center justify-between pt-2 border-t border-border"><div className="h-1.5 w-20 rounded-full bg-surface-secondary"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${task.progress}%` }} /></div>{assignee && <Avatar fallback={assignee.name.charAt(0)} size="sm" />}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
