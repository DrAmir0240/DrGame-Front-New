import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export interface AuthProfile {
  first_name: string;
  last_name: string;
  phone: string;
  user_pic: string | null;
  has_address: boolean;
}

export interface AuthStatus {
  is_authenticated: boolean;
  user_type: string;
  is_complete_profile: boolean;
  is_manager: boolean;
  is_employee: boolean;
  employee_role: string | null;
  user_name: string;
  phone: string;
  user_id: string;
  user_pic: string | null;
  employee_permissions: string[];
  profile?: AuthProfile | null;
}

export function useGetAuthQuery() {
  return useQuery<AuthStatus>({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const { data } = await api.get<AuthStatus>("/users/auth/status/");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
