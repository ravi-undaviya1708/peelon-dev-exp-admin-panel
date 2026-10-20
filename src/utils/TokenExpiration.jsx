import { jwtDecode } from "jwt-decode";

export const checkTokenExpiration = (accessToken) => {
    if (!accessToken) return true;
    try {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };