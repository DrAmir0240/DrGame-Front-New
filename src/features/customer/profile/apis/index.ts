import { useQuery } from "@tanstack/react-query";
import type { Profile } from "../types";
import api from "@/api/api";

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ["customer", "profile"],
    queryFn: async () => {
      const { data } = await api.get<Profile>("/customer/profile/");
      return data;
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Profile>) => {
      const { data } = await api.patch<Profile>("/customer/profile/", payload);

      return data;
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["customer", "profile"], data);

      queryClient.invalidateQueries({
        queryKey: ["customer", "profile"],
      });
    },
  });
}
