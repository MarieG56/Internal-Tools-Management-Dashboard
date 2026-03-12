"use client";

import { useCallback, useEffect, useState } from "react";
import { getDepartments, getTools } from "../utils/api";
import type { ApiTool, Department } from "../utils/apiTypes";

export function useToolsData(pollingIntervalMs?: number) {
  const [tools, setTools] = useState<ApiTool[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const [toolsData, departmentsData] = await Promise.all([
        getTools(),
        getDepartments(),
      ]);
      
      // Filter out tools with the name "test" or department "test"
      const filteredTools = toolsData.filter(
        (tool) => 
          tool.name.toLowerCase() !== "test" && 
          tool.owner_department?.toLowerCase() !== "test"
      );

      setTools(filteredTools);
      setDepartments(departmentsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!pollingIntervalMs) return;
    const interval = setInterval(() => {
      void refresh(true); // silent refresh
    }, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [pollingIntervalMs, refresh]);

  return {
    tools,
    setTools,
    departments,
    isLoading,
    error,
    refresh,
  };
}
