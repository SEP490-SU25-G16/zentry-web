import { instance } from "lib/axios";

const DefinitionServices = {
  createDefinition: async (definition) => {
    const {
      key,
      displayName,
      description,
      dataType,
      allowedScopeTypes,
      unit,
      defaultValue,
      isDeletable,
      options
    } = definition;
    try {
      const { data } = await instance.post("/configurations/definitions", {
        key,
        displayName,
        description,
        dataType,
        allowedScopeTypes,
        unit,
        defaultValue: String(defaultValue),
        isDeletable,
        options
      });
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: error.response
          ? error.response.data.error.message
          : "An error occurred while creating the definition."
      };
    }
  },
  getDefinitions: async () => {
    try {
      const { data } = await instance.get("/configurations/definitions?PageSize=100");
      return {
        data: data?.Data?.AttributeDefinitions,
        error: null
      };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: error.response
          ? error.response.data.error.message
          : "An error occurred while fetching definitions."
      };
    }
  },
  updateDefinition: async (definitionId, definition) => {
    try {
      const { data } = await instance.put(
        `/configurations/definitions/${definitionId}`,
        definition
      );
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response ? error.response.data?.Error?.Message : "Failed to update definition"
      };
    }
  },
  deleteDefinition: async (definitionId) => {
    try {
      const { data } = await instance.delete(`/configurations/definitions/${definitionId}`);
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response ? error.response.data?.error?.message : "Failed to delete definition"
      };
    }
  }
};

export default DefinitionServices;
