import { instance } from "lib/axios";

const UserServices = {
  createUser: async (userData) => {
    try {
      const { data } = await instance.post("/user", userData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.message : "Network Error"
      };
    }
  },
  getUsers: async (params) => {
    try {
      const { data } = await instance.get("/user", {
        params: {
          ...params,
          PageSize: 2000
        }
      });
      return {
        data: data,
        error: null
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  getUserById: async (userId) => {
    try {
      const { data } = await instance.get(`/user/${userId}`);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  updateUser: async (userId, userData) => {
    try {
      const { data } = await instance.put(`/user/${userId}`, userData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.message : "Network Error"
      };
    }
  },
  deleteUser: async (userId) => {
    try {
      const { data } = await instance.delete(`/user/${userId}`);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  }
};

export default UserServices;
