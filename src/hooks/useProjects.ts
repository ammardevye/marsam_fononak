"use client";

import { useEffect, useState } from "react";
import { projectService } from "@/lib/localStore";
import type { Project } from "@/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setProjects(projectService.getAll());
    setIsLoading(false);

    // Subscribe to changes
    const unsubscribe = projectService.subscribe((updatedProjects) => {
      setProjects([...updatedProjects]);
    });

    return () => unsubscribe();
  }, []);

  const createProject = (project: Omit<Project, "id" | "lastUpdated">) => {
    return projectService.create(project);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    return projectService.update(id, updates);
  };

  const deleteProject = (id: string) => {
    return projectService.delete(id);
  };

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
  };
}
