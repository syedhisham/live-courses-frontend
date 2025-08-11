import axiosInstance from "@/utils/axiosInterceptor";
import axios from "axios";

export const listAllCoursesApi = async () => {
  try {
    const res = await axiosInstance.get('/courses/list');
    return res.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error in listing all courses");
  }
};

export const listAllMyPurchasedCoursesApi = async () => {
  try {
    const res = await axiosInstance.get('/courses/purchased');
    return res.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error in listing my bought courses");
  }
};