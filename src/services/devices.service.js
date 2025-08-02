import { instance } from "lib/axios";

const DeviceServices = {
  getDevices: async () => {
    try {
      const { data } = await instance.get("/devices", {
        params: {
          pageSize: 2000 // Fetch all devices
        }
      });

      // Handle the API response structure with Success and Data properties
      if (data && data.Success) {
        return {
          data: data.Data.Devices || [],
          error: null
        };
      } else {
        return {
          data: [],
          error: "Invalid response format"
        };
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  addDevice: async (deviceData) => {
    try {
      const { data } = await instance.post("/devices", deviceData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error adding device:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  editDevice: async (deviceId, deviceData) => {
    try {
      const { data } = await instance.put(`/devices/${deviceId}`, deviceData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error editing device:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  deleteDevice: async (deviceId) => {
    try {
      const { data } = await instance.delete(`/devices/${deviceId}`);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error deleting device:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  approveDevice: async (deviceId) => {
    try {
      const { data } = await instance.put(`/devices/${deviceId}/approve`);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error approving device:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  rejectDevice: async (deviceId) => {
    try {
      const { data } = await instance.put(`/devices/${deviceId}/reject`);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error rejecting device:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  }
};

export default DeviceServices;
