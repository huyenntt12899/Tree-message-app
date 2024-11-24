import axios from "axios";
import { API_URL } from "../configs";

export const fetchMessages = async () => {
  return axios.get(`${API_URL}/messages`);
};

export const postMessage = async (
  content: string,
  userId: string,
  parentId: number | null
) => {
  const dataUser = localStorage.getItem("userData");
  return axios.post(
    `${API_URL}/messages`,
    { content, userId, parentId },
    {
      headers: { Authorization: "Bearer " + JSON.parse(dataUser ?? "")?.token },
    }
  );
};
