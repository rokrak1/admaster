import { IUser } from "@/context/auth.context";
import axios from "axios";
import api from ".";

interface LoginResponse {
  user: IUser;
}

export const login = async (
  email: string,
  password: string
): Promise<[LoginResponse | null, unknown]> => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return [{ user: response.data.user }, null];
  } catch (error) {
    return [null, error];
  }
};

export const me = async (): Promise<[LoginResponse | null, unknown]> => {
  try {
    const response = await api.get(`${import.meta.env.VITE_API_URL}/me`, {
      withCredentials: true,
    });

    return [{ user: response.data }, null];
  } catch (error) {
    return [null, error];
  }
};

export const register = async (
  email: string,
  password: string,
  countryCode: string
) => {
  try {
    const response = await api.post("/auth/register", {
      email,
      password,
      countryCode,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
