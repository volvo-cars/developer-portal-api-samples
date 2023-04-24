const REFRESH_TOKEN_COOKIE = "refresh_token";
const ACCESS_TOKEN_COOKIE = "access_token";

const cookies = {
  get: (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }

    return null;
  },

  delete: (name) => {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
};

const getTokenCookies = () => ({
  refreshToken: cookies.get(REFRESH_TOKEN_COOKIE),
  accessToken: cookies.get(ACCESS_TOKEN_COOKIE),
});

const clearTokenCookies = () => {
  cookies.delete(REFRESH_TOKEN_COOKIE);
  cookies.delete(ACCESS_TOKEN_COOKIE);
};
