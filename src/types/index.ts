/**
 * NOVA Hub Type Definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "admin" | "member" | "viewer";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "planning" | "on-hold";
  priority: "high" | "medium" | "low";
  progress: number;
  ownerId: string;
  memberIds: string[];
  taskCount: number;
  completedTasks: number;
  startDate: string;
  dueDate: string;
  lastUpdated: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: "new" | "in-progress" | "review" | "completed" | "blocked" | "cancelled";
  priority: "high" | "medium" | "low";
  assigneeId: string | null;
  dueDate: string;
  progress: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  status: "upcoming" | "completed" | "cancelled";
  type: "team" | "client" | "workshop" | "other";
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  category: string;
  contextWindow: number;
  speed: "fast" | "medium" | "slow";
  quality: "excellent" | "good" | "fair";
  available: boolean;
}

export interface Criterion {
  id: string;
  name: string;
  category: string;
  weight: number;
  description: string;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  author: string;
  date: string;
  status: "draft" | "completed";
  summary: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  ownerId: string;
  date: string;
  status: "active" | "archived";
}

export interface Question {
  id: string;
  title: string;
  category: string;
  status: "pending" | "answered";
  priority: "high" | "medium" | "low";
  author: string;
  date: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityType: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: string;
}
