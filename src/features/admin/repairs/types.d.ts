export type DeviceType = "console" | "controller" | "other";

export type RepairStatus =
  | "pending"
  | "received"
  | "under_review"
  | "price_set"
  | "approved"
  | "in_repair"
  | "repaired"
  | "completed";

export interface RepairOrder {
  id: number;
  created_date: string;
  device_type: DeviceType;
  device_model: string;
  issue_description: string;
  notes: string;
  technician_price: number | null;
  final_price: number | null;
  status: RepairStatus;
}

export interface RepairFormData {
  device_type: DeviceType;
  device_model: string;
  issue_description: string;
  notes: string;
}
