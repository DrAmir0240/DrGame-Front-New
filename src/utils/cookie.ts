import Cookies from "js-cookie";

const setCookie = (access_token: string | null | undefined, refresh_token: string | null | undefined): void => {
  if (typeof access_token !== "undefined" && access_token !== null) {
    Cookies.set("access_token", access_token, {
      expires: 1,
      path: "/",
    });
  }

  if (typeof refresh_token !== "undefined" && refresh_token !== null) {
    Cookies.set("refresh_token", refresh_token, {
      expires: 30,
      path: "/",
    });
  }
};

const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

const setAccess = (token: string): void => {
  if (token) {
    const isSecure = window.location.protocol === "https:";
    Cookies.set("access_token", token, {
      expires: 1,
      secure: isSecure,
      sameSite: "Strict",
      path: "/",
    });
  }
};

const setRefresh = (token: string): void => {
  if (token) {
    const isSecure = window.location.protocol === "https:";
    Cookies.set("refresh_token", token, {
      expires: 30,
      secure: isSecure,
      sameSite: "Strict",
      path: "/",
    });
  }
};

const deleteCookie = (name: string): void => {
  const isSecure = window.location.protocol === "https:";
  Cookies.remove(name, {
    path: "/",
    secure: isSecure,
    sameSite: "Strict",
  });
};

export { setCookie, getCookie, deleteCookie, setAccess, setRefresh };
