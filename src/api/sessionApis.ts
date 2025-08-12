import axiosInstance from "@/utils/axiosInterceptor";
import axios from "axios"; 

export const scheduleLiveSessionApi = async (data: {
    courseId: string,
    startTime: string
}) => {
  try {
    const response = await axiosInstance.post("/sessions/schedule", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error scheduling session");
  }
};

export const startLiveSessionApi = async (sessionId: string) => {
  try {
    const response = await axiosInstance.post(`/sessions/${sessionId}/start`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error starting session");
  }
};
