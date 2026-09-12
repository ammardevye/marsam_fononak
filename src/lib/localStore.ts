/**
 * NOVA Hub Local Data Store
 * Browser-local storage for demo data - NOT a real backend
 * Changes are persisted only in browser localStorage
 */

import { demoProjects, demoTasks, demoUsers } from "@/data/demoData";
import type { Project, Task, User } from "@/types";

// Storage keys
const PROJECTS_KEY = "nova_projects";
const TASKS_KEY = "nova_tasks";

// Initialize with demo data if no stored data exists
function getInitialProjects(): Project[] {
  if (typeof window === "undefined") {
    return demoProjects;
  }
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Project[];
      }
    }
  } catch (e) {
    console.error("Error reading projects from localStorage:", e);
  }
  return demoProjects;
}

function getInitialTasks(): Task[] {
  if (typeof window === "undefined") {
    return demoTasks;
  }
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Task[];
      }
    }
  } catch (e) {
    console.error("Error reading tasks from localStorage:", e);
  }
  return demoTasks;
}

// In-memory state (will be synced with localStorage)
let projectsState: Project[] = getInitialProjects();
let tasksState: Task[] = getInitialTasks();

// Listeners for state changes
type ProjectsListener = (projects: Project[]) => void;
type TasksListener = (tasks: Task[]) => void;

const projectsListeners: Set<ProjectsListener> = new Set();
const tasksListeners: Set<TasksListener> = new Set();

function notifyProjectsListeners() {
  projectsListeners.forEach((listener) => listener(projectsState));
}

function notifyTasksListeners() {
  tasksListeners.forEach((listener) => listener(tasksState));
}

// Persist to localStorage
function persistProjects() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projectsState));
    } catch (e) {
      console.error("Error saving projects to localStorage:", e);
    }
  }
}

function persistTasks() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasksState));
    } catch (e) {
      console.error("Error saving tasks to localStorage:", e);
    }
  }
}

// Project operations
export const projectService = {
  getAll(): Project[] {
    return [...projectsState];
  },

  getById(id: string): Project | undefined {
    return projectsState.find((p) => p.id === id);
  },

  create(project: Omit<Project, "id" | "lastUpdated">): Project {
    const newProject: Project = {
      ...project,
      id: `p${Date.now()}`,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    projectsState = [...projectsState, newProject];
    persistProjects();
    notifyProjectsListeners();
    return newProject;
  },

  update(id: string, updates: Partial<Project>): Project | null {
    const index = projectsState.findIndex((p) => p.id === id);
    if (index === -1) return null;
    
    const updatedProject: Project = {
      ...projectsState[index],
      ...updates,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    projectsState[index] = updatedProject;
    persistProjects();
    notifyProjectsListeners();
    return updatedProject;
  },

  delete(id: string): boolean {
    const index = projectsState.findIndex((p) => p.id === id);
    if (index === -1) return false;
    
    // Remove or mark orphaned tasks
    const orphanedTasks = tasksState.filter((t) => t.projectId === id);
    if (orphanedTasks.length > 0) {
      // Remove tasks belonging to deleted project
      tasksState = tasksState.filter((t) => t.projectId !== id);
      persistTasks();
      notifyTasksListeners();
    }
    
    projectsState = projectsState.filter((p) => p.id !== id);
    persistProjects();
    notifyProjectsListeners();
    return true;
  },

  subscribe(listener: ProjectsListener): () => void {
    projectsListeners.add(listener);
    return () => projectsListeners.delete(listener);
  },

  resetToDemo(): void {
    projectsState = [...demoProjects];
    tasksState = [...demoTasks];
    persistProjects();
    persistTasks();
    notifyProjectsListeners();
    notifyTasksListeners();
  },
};

// Task operations
export const taskService = {
  getAll(): Task[] {
    return [...tasksState];
  },

  getById(id: string): Task | undefined {
    return tasksState.find((t) => t.id === id);
  },

  getByProjectId(projectId: string): Task[] {
    return tasksState.filter((t) => t.projectId === projectId);
  },

  create(task: Omit<Task, "id">): Task {
    const newTask: Task = {
      ...task,
      id: `t${Date.now()}`,
    };
    tasksState = [...tasksState, newTask];
    persistTasks();
    notifyTasksListeners();
    
    // Update project task count
    const project = projectService.getById(task.projectId);
    if (project) {
      projectService.update(task.projectId, {
        taskCount: project.taskCount + 1,
        completedTasks: task.status === "completed" ? project.completedTasks + 1 : project.completedTasks,
      });
    }
    
    return newTask;
  },

  update(id: string, updates: Partial<Task>): Task | null {
    const index = tasksState.findIndex((t) => t.id === id);
    if (index === -1) return null;
    
    const oldTask = tasksState[index];
    const updatedTask: Task = {
      ...oldTask,
      ...updates,
    };
    tasksState[index] = updatedTask;
    persistTasks();
    notifyTasksListeners();
    
    // Update project statistics if status changed
    if (updates.status && updates.status !== oldTask.status) {
      const project = projectService.getById(oldTask.projectId);
      if (project) {
        let completedTasks = project.completedTasks;
        if (oldTask.status === "completed" && updates.status !== "completed") {
          completedTasks = Math.max(0, completedTasks - 1);
        } else if (oldTask.status !== "completed" && updates.status === "completed") {
          completedTasks = completedTasks + 1;
        }
        projectService.update(oldTask.projectId, { completedTasks });
      }
    }
    
    return updatedTask;
  },

  delete(id: string): boolean {
    const task = tasksState.find((t) => t.id === id);
    if (!task) return false;
    
    // Update project task count
    const project = projectService.getById(task.projectId);
    if (project) {
      projectService.update(task.projectId, {
        taskCount: Math.max(0, project.taskCount - 1),
        completedTasks: task.status === "completed" ? Math.max(0, project.completedTasks - 1) : project.completedTasks,
      });
    }
    
    tasksState = tasksState.filter((t) => t.id !== id);
    persistTasks();
    notifyTasksListeners();
    return true;
  },

  subscribe(listener: TasksListener): () => void {
    tasksListeners.add(listener);
    return () => tasksListeners.delete(listener);
  },
};

// Utility functions for searching and filtering
export function searchProjects(query: string, projects: Project[]): Project[] {
  if (!query.trim()) return projects;
  const lowerQuery = query.toLowerCase();
  return projects.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

export function filterProjectsByStatus(
  projects: Project[],
  status: string | null
): Project[] {
  if (!status) return projects;
  return projects.filter((p) => p.status === status);
}

export function sortProjects(
  projects: Project[],
  sortBy: "name" | "dueDate" | "lastUpdated" | "priority",
  order: "asc" | "desc" = "desc"
): Project[] {
  const sorted = [...projects].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "lastUpdated") {
      return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });
  return order === "desc" ? sorted.reverse() : sorted;
}

export function searchTasks(query: string, tasks: Task[]): Task[] {
  if (!query.trim()) return tasks;
  const lowerQuery = query.toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery)
  );
}

export function filterTasksByStatus(
  tasks: Task[],
  status: string | null
): Task[] {
  if (!status) return tasks;
  return tasks.filter((t) => t.status === status);
}

export function filterTasksByPriority(
  tasks: Task[],
  priority: string | null
): Task[] {
  if (!priority) return tasks;
  return tasks.filter((t) => t.priority === priority);
}

export function filterTasksByProject(
  tasks: Task[],
  projectId: string | null
): Task[] {
  if (!projectId) return tasks;
  return tasks.filter((t) => t.projectId === projectId);
}

export function sortTasks(
  tasks: Task[],
  sortBy: "title" | "dueDate" | "priority" | "status",
  order: "asc" | "desc" = "desc"
): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "priority") {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === "status") {
      const statusOrder = { new: 1, "in-progress": 2, review: 3, blocked: 4, completed: 5, cancelled: 6 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });
  return order === "desc" ? sorted.reverse() : sorted;
}
