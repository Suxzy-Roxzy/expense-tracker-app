import { COOKIE_NAME, NODE_ENV } from "../data/constant";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AxiosInstance } from "@/data/instance";
// import { email } from "zod";

export type TokenType = {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
};

export type JwtPayload = {
  expiration_time: number; // Expiration time (in seconds)
  iat?: number;
  [key: string]: any;
};

// GET TOKEN FROM COOKIES
export const getToken = (): string | null => {
  const tokenData = Cookies.get(COOKIE_NAME);
  if (!tokenData) return null;
  try {
    const parsedData: TokenType = JSON.parse(tokenData);
    const decodedToken = jwtDecode<JwtPayload>(parsedData.access_token);

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decodedToken.exp < currentTime) {
      // Token has expired
      return null;
    }
    return parsedData.access_token;
  } catch {
    Cookies.remove(COOKIE_NAME);
    return null;
  }
};

// Get User ID from Cookies
export const getUserId = (): string | null => {
  const tokenData = Cookies.get(COOKIE_NAME);
  if (!tokenData) return null;
  try {
    const parsedData: TokenType = JSON.parse(tokenData);
    return parsedData.user.id;
  } catch (error) {
    console.error("Error parsing token data:", error);
    // Cookies.remove(COOKIE_NAME); "Removing Te cookie Name"
    return null;
  }
};

// Save Token to Cookies
export const saveToken = (data: TokenType) => {
  const { access_token, refresh_token, user } = data;
  const decodedToken = jwtDecode<{ expiration_time?: number }>(access_token);
  if (!decodedToken.expiration_time) {
    console.warn("Access Token does not have an expiration field.");
    return;
  }
  const expirationDate = new Date(decodedToken.expiration_time * 1000); // Convert to milliseconds
  const tokenData = {
    access_token,
    refresh_token,
    user: {
      email: user.email,
      id: user.id,
    },
  };
  Cookies.set(COOKIE_NAME, JSON.stringify(tokenData), {
    expires: expirationDate,
    secure: NODE_ENV === "production",
    sameSite: "Strict", //ensure cookie is only sent in same site requests
    path: "/", // ensure cookie is sent on all paths
  });
};

// REMOVE TOKEN FROM COOKIES
export const removeToken = () => {
  Cookies.remove(COOKIE_NAME);
}

// GET USER FROM THE DATABASE BY EMAIL
export const getUserByEmail = async ( email: string) => {
    const response = await AxiosInstance.get(`/users/user_by_email/${email}`);
    return response.data;
};


// GET TOKEN BY EMAIL
export const getTokenByEmail = async ( email: string) => {
    const response = await AxiosInstance.get(`users/token/${email}`);
    return response.data;
}

