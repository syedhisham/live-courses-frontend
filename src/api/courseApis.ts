import axiosInstance from "@/utils/axiosInterceptor";
import axios from "axios";

export const listAllCoursesApi = async (page = 1) => {
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

// Step 1
export const createCourseApi = async (data: {
  title: string,
  description: string,
  price: number
}) => {
  try {
    const res = await axiosInstance.post('/courses/create', data);
    return res.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error in creating course");
  }
};

// Step 2
export const getUploadUrlApi = async (courseId: string ,data: {
  fileName: string,
  contentType: string,
}) => {
  try {
    const res = await axiosInstance.post(`/courses/${courseId}/materials/upload-url`, data);
    return res.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error in get upload upload URL");
  }
};

// Step 3
export const addMaterialApi = async (courseId: string ,data: {
  key: string,
  filename: string,
  contentType: string
}) => {
  try {
    const res = await axiosInstance.post(`/courses/${courseId}/materials`, data);
    return res.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error in adding material to course");
  }
};

export const getMaterialAccessUrlApi = async (courseId: string, materialId: string) => {
  try {
    const res = await axiosInstance.get(`/courses/${courseId}/materials/${materialId}/access-url`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error in fetching access url");
  }
};


