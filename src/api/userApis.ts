import axiosInstance from "@/utils/axiosInterceptor";
import axios from "axios"; 

export const fetchMeApi = async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error fetching user details");
  }
};
