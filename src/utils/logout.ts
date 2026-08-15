import { deleteCookie } from "@/utils/cookie";

export function logout() {
  deleteCookie("access_token");
  deleteCookie("refresh_token");

  window.location.href = "/login";
}
