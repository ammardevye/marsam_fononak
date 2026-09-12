/**
 * NOVA Hub Demo Data
 * UI preview data only - not connected to any backend
 * Marked as demo data for Phase 1
 */

import type { Project, Task, User, Meeting, Model, Criterion, Report, Document, Question, Activity, Notification } from "@/types";

// Demo Users
export const demoUsers: User[] = [
  { id: "u1", name: "أحمد محمد", email: "ahmed@novahub.com", avatar: null, role: "admin" },
  { id: "u2", name: "فاطمة علي", email: "fatima@novahub.com", avatar: null, role: "member" },
  { id: "u3", name: "محمد حسن", email: "mohamed@novahub.com", avatar: null, role: "member" },
  { id: "u4", name: "سارة أحمد", email: "sara@novahub.com", avatar: null, role: "viewer" },
  { id: "u5", name: "خالد إبراهيم", email: "khaled@novahub.com", avatar: null, role: "member" },
];

// Demo Projects
export const demoProjects: Project[] = [
  {
    id: "p1",
    name: "تطوير منصة التجارة الإلكترونية",
    description: "إعادة تصميم وتطوير منصة التجارة الإلكترونية الرئيسية",
    status: "active",
    priority: "high",
    progress: 65,
    ownerId: "u1",
    memberIds: ["u1", "u2", "u3"],
    taskCount: 24,
    completedTasks: 16,
    startDate: "2025-01-15",
    dueDate: "2025-03-30",
    lastUpdated: "2025-02-10",
  },
  {
    id: "p2",
    name: "نظام إدارة الموارد البشرية",
    description: "بناء نظام متكامل لإدارة الموارد البشرية والرواتب",
    status: "active",
    priority: "medium",
    progress: 40,
    ownerId: "u2",
    memberIds: ["u2", "u4"],
    taskCount: 18,
    completedTasks: 7,
    startDate: "2025-02-01",
    dueDate: "2025-05-15",
    lastUpdated: "2025-02-09",
  },
  {
    id: "p3",
    name: "تطبيق الجوال للعملاء",
    description: "تطوير تطبيق جوال لمنصة العملاء",
    status: "planning",
    priority: "high",
    progress: 15,
    ownerId: "u3",
    memberIds: ["u3", "u5"],
    taskCount: 32,
    completedTasks: 5,
    startDate: "2025-02-10",
    dueDate: "2025-06-30",
    lastUpdated: "2025-02-08",
  },
  {
    id: "p4",
    name: "لوحة التحليلات والتقارير",
    description: "إنشاء لوحة تحكم شاملة للتحليلات والتقارير",
    status: "completed",
    priority: "medium",
    progress: 100,
    ownerId: "u1",
    memberIds: ["u1", "u2", "u4"],
    taskCount: 20,
    completedTasks: 20,
    startDate: "2024-11-01",
    dueDate: "2025-01-31",
    lastUpdated: "2025-01-30",
  },
  {
    id: "p5",
    name: "نظام الدفع الإلكتروني",
    description: "تكامل نظام دفع إلكتروني آمن",
    status: "on-hold",
    priority: "low",
    progress: 30,
    ownerId: "u5",
    memberIds: ["u5"],
    taskCount: 15,
    completedTasks: 5,
    startDate: "2025-01-20",
    dueDate: "2025-04-20",
    lastUpdated: "2025-02-05",
  },
];

// Demo Tasks
export const demoTasks: Task[] = [
  { id: "t1", title: "تصميم واجهة المستخدم الرئيسية", description: "إنشاء تصاميم أولية لواجهة المستخدم", projectId: "p1", status: "completed", priority: "high", assigneeId: "u2", dueDate: "2025-02-05", progress: 100 },
  { id: "t2", title: "تطوير نظام المصادقة", description: "بناء نظام تسجيل الدخول والمصادقة", projectId: "p1", status: "in-progress", priority: "high", assigneeId: "u3", dueDate: "2025-02-15", progress: 70 },
  { id: "t3", title: "اختبار الأداء", description: "إجراء اختبارات الأداء للنظام", projectId: "p1", status: "pending", priority: "medium", assigneeId: "u1", dueDate: "2025-02-20", progress: 0 },
  { id: "t4", title: "كتابة التوثيق التقني", description: "توثيق الكود والواجهات البرمجية", projectId: "p2", status: "in-progress", priority: "low", assigneeId: "u4", dueDate: "2025-02-25", progress: 40 },
  { id: "t5", title: "مراجعة الأمان", description: "مراجعة شاملة لأمان النظام", projectId: "p2", status: "review", priority: "high", assigneeId: "u1", dueDate: "2025-02-18", progress: 80 },
  { id: "t6", title: "تحسين محركات البحث", description: "تحسين SEO للمنصة", projectId: "p3", status: "blocked", priority: "medium", assigneeId: "u5", dueDate: "2025-02-28", progress: 20 },
  { id: "t7", title: "إعداد بيئة الإنتاج", description: "تهيئة خوادم الإنتاج", projectId: "p1", status: "pending", priority: "high", assigneeId: "u3", dueDate: "2025-03-01", progress: 0 },
  { id: "t8", title: "تدريب المستخدمين", description: "جلسات تدريب للمستخدمين النهائيين", projectId: "p4", status: "completed", priority: "medium", assigneeId: "u2", dueDate: "2025-01-25", progress: 100 },
];

// Demo Meetings
export const demoMeetings: Meeting[] = [
  { id: "m1", title: "اجتماع مراجعة الأسبوع", date: "2025-02-17", time: "10:00", participants: ["u1", "u2", "u3"], status: "upcoming", type: "team" },
  { id: "m2", title: "عرض التصميم للعميل", date: "2025-02-18", time: "14:00", participants: ["u1", "u2"], status: "upcoming", type: "client" },
  { id: "m3", title: "ورشة عمل التخطيط", date: "2025-02-20", time: "09:00", participants: ["u1", "u2", "u3", "u4", "u5"], status: "upcoming", type: "workshop" },
  { id: "m4", title: "اجتماع إغلاق المشروع", date: "2025-01-30", time: "11:00", participants: ["u1", "u2", "u4"], status: "completed", type: "team" },
];

// Demo AI Models
export const demoModels: Model[] = [
  { id: "model1", name: "GPT-4 Turbo", provider: "OpenAI", category: "chat", contextWindow: 128000, speed: "fast", quality: "excellent", available: true },
  { id: "model2", name: "Claude 3.5 Sonnet", provider: "Anthropic", category: "chat", contextWindow: 200000, speed: "medium", quality: "excellent", available: true },
  { id: "model3", name: "Gemini Pro", provider: "Google", category: "multimodal", contextWindow: 32000, speed: "fast", quality: "good", available: true },
  { id: "model4", name: "Llama 3.1 70B", provider: "Meta", category: "open-source", contextWindow: 128000, speed: "medium", quality: "good", available: false },
  { id: "model5", name: "Mistral Large", provider: "Mistral", category: "chat", contextWindow: 32000, speed: "fast", quality: "good", available: true },
];

// Demo Criteria
export const demoCriteria: Criterion[] = [
  { id: "c1", name: "جودة الإجابة", category: "quality", weight: 30, description: "دقة وملاءمة الإجابة المقدمة" },
  { id: "c2", name: "السرعة", category: "performance", weight: 20, description: "وقت الاستجابة للنموذج" },
  { id: "c3", name: "التكلفة", category: "cost", weight: 25, description: "تكلفة الاستخدام لكل طلب" },
  { id: "c4", name: "السياق", category: "capability", weight: 15, description: "قدرة النموذج على فهم السياق الطويل" },
  { id: "c5", name: "اللغة العربية", category: "language", weight: 10, description: "جودة الدعم للغة العربية" },
];

// Demo Reports
export const demoReports: Report[] = [
  { id: "r1", title: "تقرير أداء النماذج - يناير 2025", type: "performance", author: "u1", date: "2025-01-31", status: "completed", summary: "تحليل شامل لأداء النماذج المختلفة" },
  { id: "r2", title: "تقرير استخدام المنصة", type: "usage", author: "u2", date: "2025-02-05", status: "completed", summary: "إحصائيات استخدام المنصة الشهرية" },
  { id: "r3", title: "تقييم الجودة الشامل", type: "quality", author: "u1", date: "2025-02-10", status: "draft", summary: "تقييم جودة مخرجات النماذج" },
];

// Demo Documents
export const demoDocuments: Document[] = [
  { id: "d1", name: "متطلبات المشروع.pdf", type: "pdf", size: "2.4 MB", ownerId: "u1", date: "2025-02-01", status: "active" },
  { id: "d2", name: "دليل الاستخدام.docx", type: "docx", size: "1.8 MB", ownerId: "u2", date: "2025-02-05", status: "active" },
  { id: "d3", name: "عرض تقديمي.pptx", type: "pptx", size: "5.2 MB", ownerId: "u3", date: "2025-02-08", status: "active" },
  { id: "d4", name: "بيانات التحليل.xlsx", type: "xlsx", size: "3.1 MB", ownerId: "u1", date: "2025-02-10", status: "active" },
];

// Demo Questions
export const demoQuestions: Question[] = [
  { id: "q1", title: "كيفية تحسين دقة النماذج؟", category: "technical", status: "answered", priority: "high", author: "u2", date: "2025-02-08" },
  { id: "q2", title: "ما هي أفضل ممارسة لإدارة السياق؟", category: "best-practices", status: "pending", priority: "medium", author: "u3", date: "2025-02-09" },
  { id: "q3", title: "سؤال حول التكامل مع APIs", category: "integration", status: "answered", priority: "low", author: "u4", date: "2025-02-10" },
];

// Demo Activities
export const demoActivities: Activity[] = [
  { id: "a1", userId: "u1", action: "أنشأ مهمة جديدة", entity: "تطوير واجهة المستخدم", entityType: "task", timestamp: "2025-02-10T10:30:00" },
  { id: "a2", userId: "u2", action: "أكمل مهمة", entity: "تصميم الواجهة الرئيسية", entityType: "task", timestamp: "2025-02-10T09:15:00" },
  { id: "a3", userId: "u3", action: "حدث حالة المشروع", entity: "نظام إدارة الموارد البشرية", entityType: "project", timestamp: "2025-02-09T16:45:00" },
  { id: "a4", userId: "u1", action: "أضاف عضو جديد", entity: "فريق التطوير", entityType: "team", timestamp: "2025-02-09T14:20:00" },
  { id: "a5", userId: "u4", action: "رفع ملف", entity: "متطلبات المشروع.pdf", entityType: "document", timestamp: "2025-02-09T11:00:00" },
];

// Demo Notifications
export const demoNotifications: Notification[] = [
  { id: "n1", title: "مهمة جديدة مُسندة إليك", message: "تم إسناد مهمة \"تطوير الواجهة\" إليك", type: "task", read: false, timestamp: "2025-02-10T10:30:00" },
  { id: "n2", title: "اجتماع قادم", message: "اجتماع مراجعة الأسبوع خلال ساعتين", type: "meeting", read: false, timestamp: "2025-02-10T08:00:00" },
  { id: "n3", title: "اكتمل المشروع", message: "تم إكمال مشروع \"لوحة التحليلات\"", type: "project", read: true, timestamp: "2025-01-30T15:00:00" },
  { id: "n4", title: "تعليق جديد", message: "أحمد علّق على المهمة #12", type: "comment", read: true, timestamp: "2025-02-09T12:00:00" },
];

// Dashboard statistics (demo)
export const dashboardStats = {
  activeProjects: 3,
  completedProjects: 1,
  totalTasks: 24,
  pendingTasks: 8,
  upcomingMeetings: 3,
  teamMembers: 5,
};
