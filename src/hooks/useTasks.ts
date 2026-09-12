"use client";

import { useEffect, useState } from "react";
import { taskService } from "@/lib/localStore";
import type { Task } from "@/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setTasks(taskService.getAll());
    setIsLoading(false);

    // Subscribe to changes
    const unsubscribe = taskService.subscribe((updatedTasks) => {
      setTasks([...updatedTasks]);
    });

    return () => unsubscribe();
  }, []);

  const createTask = (task: Omit<Task, "id">) => {
    return taskService.create(task);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    return taskService.update(id, updates);
  };

  const deleteTask = (id: string) => {
    return taskService.delete(id);
  };

  const getTasksByProjectId = (projectId: string) => {
    return taskService.getByProjectId(projectId);
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    getTasksByProjectId,
  };
}
