import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import type { OtpResponse } from "../types";
import { API_ENDPOINTS } from "../constants";

export const useLoginOtp = () => {
  const queryClient = useQueryClient();
  const mutationFn = (data: { phone: string }) =>
    api.post<OtpResponse>(API_ENDPOINTS.requestOtp, data);
  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => {
       console.log(err)
    }
  });
};
