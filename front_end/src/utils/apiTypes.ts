export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type ApiToolStatus = "active" | "unused" | "expiring";

export interface ApiTool {
  id: number;
  name: string;
  description: string;
  vendor: string;
  category: string;
  monthly_cost: number;
  previous_month_cost: number;
  owner_department: string;
  status: ApiToolStatus;
  website_url: string;
  active_users_count: number;
  icon_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateToolPayload {
  name: string;
  description: string;
  vendor: string;
  category: string;
  monthly_cost: number;
  previous_month_cost: number;
  owner_department: string;
  status: ApiToolStatus;
  website_url: string;
  active_users_count: number;
  icon_url?: string;
}

export type UpdateToolPayload = Partial<CreateToolPayload>;
