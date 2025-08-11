import axiosInstance from "@/utils/axiosInterceptor";
import axios from "axios";

export const createCheckoutSessionApi = async (data: {
    courseId: string
}) => {
  try {
    const res = await axiosInstance.post('/payments/create-checkout-session', data);
    return res.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error while regestring user");
  }
};