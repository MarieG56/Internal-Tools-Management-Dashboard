"use client";

import { useCallback, useEffect, useState } from "react";
import { getDepartments, getTools } from "../utils/api";
import type { ApiTool, Department } from "../utils/apiTypes";

export function useToolsData() {
  const [tools, setTools] = useState<ApiTool[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [toolsData, departmentsData] = await Promise.all([
        getTools(),
        getDepartments(),
      ]);
      setTools(toolsData);
      setDepartments(departmentsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    tools,
    setTools,
    departments,
    isLoading,
    error,
    refresh,
  };
}
