import axiosInstance from "@/utils/axiosInterceptor";
import axios from "axios";

export const registerApi = async (data: {
  name: string;
  role: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await axiosInstance.post('/auth/register', data);
    return res.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error while regestring user");
  }
};

export const loginApi = async (data: {
  email: string,
  password: string
}) => {
  try {
    const res = await axiosInstance.post('/auth/login', data);
    return res.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error while login user");
  }
};

export const logoutApi = async () => {
  try {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error in logging out user");
  }
};
