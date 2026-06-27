import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export interface AuthStatus {
  is_authenticated: boolean;
  user_type: string;
  is_completed_profile: boolean;
  employee_role: string | null;
  user_name: string;
  phone: string ;
  user_id: string;
  user_pic: string | null;
  employee_permissions: string[];
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
