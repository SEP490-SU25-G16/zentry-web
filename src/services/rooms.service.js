import { instance } from "lib/axios";

const RoomServices = {
  getRooms: async (params) => {
    try {
      const { data } = await instance.get("/rooms", {
        params
      });
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  addRoom: async (roomData) => {
    try {
      const { data } = await instance.post("/rooms", roomData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error adding room:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  editRoom: async (roomId, roomData) => {
    try {
      const { data } = await instance.put(`/rooms/${roomId}`, roomData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error editing room:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  deleteRoom: async (roomId) => {
    try {
      const { data } = await instance.delete(`/rooms/${roomId}`);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error deleting room:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  }
};

export default RoomServices;
