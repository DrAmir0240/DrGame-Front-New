import { useMutation } from "@tanstack/react-query";
import api from "@/api/api";
import type { VerifyOtpResponse } from "../types";
import { API_ENDPOINTS } from "../constants";

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: { phone: string; code: string }) =>
      api.post<VerifyOtpResponse>(API_ENDPOINTS.verifyOtp, data),
  });
};
