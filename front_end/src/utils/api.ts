import type {
  ApiTool,
  CreateToolPayload,
  Department,
  UpdateToolPayload,
} from "./apiTypes";

const API_BASE_URL = "https://tt-jsonserver-01.alt-tools.tech";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API error (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function getDepartments(): Promise<Department[]> {
  return request<Department[]>("/departments");
}

export async function getTools(): Promise<ApiTool[]> {
  return request<ApiTool[]>("/tools?_sort=updated_at&_order=desc");
}

export async function createTool(payload: CreateToolPayload): Promise<ApiTool> {
  return request<ApiTool>("/tools", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function updateTool(id: number, payload: UpdateToolPayload): Promise<ApiTool> {
  return request<ApiTool>(`/tools/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...payload,
      updated_at: new Date().toISOString(),
    }),
  });
}
