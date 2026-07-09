export type TaskPriority = "low" | "normal" | "high" | "urgent";

export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";

export interface Task {
  id: string;
  title: string;
  description?: string;
  voice?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_to_name?: string;
  assigned_to_id?: string;
  branch_id?: string;
  due_date?: string;
  start_date?: string;
  tags?: string[];
  created_date: string;
  type?: string;
}

export interface Staff {
  id: string;
  full_name: string;
}

export interface Branch {
  id: string;
  name: string;
}

export interface TaskPersonalFormData {
  title: string;
  voice?: string;
  description?: string;
  priority: string;
  start_date: string;
  deadline: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  assigned_to_name: string;
  assigned_to_id: string;
  branch_id: string;
  due_date: string;
  tags: string[];
}
