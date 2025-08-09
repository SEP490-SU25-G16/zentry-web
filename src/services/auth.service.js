import { instance } from "lib/axios";

const AuthService = {
  requestPasswordReset: async (email) => {
    try {
      const { data } = await instance.post("/auth/reset-password/request", { email });
      return { data, error: null };
    } catch (error) {
      const message = error?.response?.data?.errors || error?.response?.data || "Network Error";
      return { data: null, error: message };
    }
  }
};

export default AuthService;


