import axios from "axios";
import { API_URL } from "../configs";

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  return axios.post(`${API_URL}/auth/register`, { username, email, password });
};

export const login = async (usernameOrEmail: string, password: string) => {
  return axios.post(`${API_URL}/auth/login`, {
    usernameOrEmail,
    password,
  });
};
