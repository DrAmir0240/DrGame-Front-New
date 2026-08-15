import { toast } from "@/components/ui";

type ApiErrorLike = {
  response?: {
    status?: number;
    data?: unknown;
  };
};

export function getApiErrorMessage(error: unknown, fallback = "خطایی رخ داد"): string {
  const err = error as ApiErrorLike;
  const data = err?.response?.data;

  if (!data) return fallback;

  if (typeof data === "string") return data || fallback;

  if (typeof data !== "object" || data === null) return fallback;

  const record = data as Record<string, unknown>;

  if (typeof record.detail === "string") return record.detail;

  if (Array.isArray(record.non_field_errors)) {
    return String(record.non_field_errors[0] ?? fallback);
  }

  const messages: string[] = [];

  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value)) {
      const first = value[0];
      if (typeof first === "string") messages.push(`${key}: ${first}`);
    } else if (typeof value === "string") {
      messages.push(`${key}: ${value}`);
    }
  }

  return messages.length ? messages.join("، ") : fallback;
}

export function toastApiError(error: unknown, fallback?: string) {
  toast.error(getApiErrorMessage(error, fallback));
}
