import { instance } from "lib/axios";

const DeviceServices = {
  getCurrentDevices: async () => {
    try {
      const response = await instance.get("/api/devices?pageSize=200", {
        params: {
          pageSize: 100,
          pageNumber: 1
        }
      });
      console.log(response);

      // Handle the API response structure with Success and Data properties
      if (response.data && response.data.Success) {
        return { data: response.data.Data.Devices || [], error: null };
      } else {
        return { data: [], error: "Invalid response format" };
      }
    } catch (error) {
      console.error("Error fetching current devices:", error);
      return { data: null, error: "Failed to fetch current devices" };
    }
  }
};

export default DeviceServices;
