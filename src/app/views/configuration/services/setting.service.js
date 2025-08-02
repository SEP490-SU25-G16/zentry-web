import { instance } from "lib/axios";

const SettingServices = {
  createSetting: async (setting) => {
    const { attributeKey, scopeType, scopeId, value } = setting;

    // Map scopeType to numeric ID as string
    let mappedScopeId;
    switch (scopeType) {
      case "Global":
        mappedScopeId = "1";
        break;
      case "Course":
        mappedScopeId = "2";
        break;
      case "Session":
        mappedScopeId = "3";
        break;
      default:
        mappedScopeId = scopeId || null; // Fallback to provided scopeId
    }

    try {
      const { data } = await instance.post("/configurations/settings", {
        attributeKey,
        scopeType: "Global",
        scopeId: null,
        value: String(value) // Ensure value is always sent as string
      });
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error(error);

      // Handle specific error codes from backend
      if (error.response?.data?.error?.code) {
        const errorCode = error.response.data.error.code;
        const errorMessage = error.response.data.error.message;

        switch (errorCode) {
          case "INVALID_GUID_FORMAT":
            return {
              data: null,
              error: "Invalid format for ScopeId."
            };
          case "SCOPE_ID_REQUIRED":
            return {
              data: null,
              error: `ScopeId is required for ${scopeType} scope.`
            };
          case "INVALID_DATA_TYPE":
            return {
              data: null,
              error: "The provided value cannot be converted to the required data type."
            };
          default:
            return {
              data: null,
              error: errorMessage || "An error occurred while creating the setting."
            };
        }
      }

      return {
        data: null,
        error:
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "An error occurred while creating the setting."
      };
    }
  },
  getSettings: async () => {
    try {
      const { data } = await instance.get("/configurations/settings", {
        params: {
          PageSize: 2000
        }
      });
      console.log("Fetched settings:", data);
      return {
        data: data?.Data?.Items || [],
        pagination: {
          totalCount: data?.Data?.TotalCount || 0,
          pageNumber: data?.Data?.PageNumber || 1,
          pageSize: data?.Data?.PageSize || 10,
          totalPages: data?.Data?.TotalPages || 1,
          hasNextPage: data?.Data?.HasNextPage || false,
          hasPreviousPage: data?.Data?.HasPreviousPage || false
        },
        error: null
      };
    } catch (error) {
      console.error(error);
      return {
        data: [],
        pagination: null,
        error:
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "An error occurred while fetching settings."
      };
    }
  }
};

export default SettingServices;
