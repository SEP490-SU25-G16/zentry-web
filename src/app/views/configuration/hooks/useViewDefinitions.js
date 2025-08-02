import { useState, useCallback } from "react";
import DefinitionServices from "../services/difinition.service";

export const useViewDefinitions = () => {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attributeDefinitions, setAttributeDefinitions] = useState([]);

  // Data type mapping
  const dataTypeMap = {
    1: "String",
    2: "Int",
    3: "Boolean",
    4: "Decimal",
    5: "Date",
    6: "Json",
    7: "Selection"
  };

  // Scope type mapping
  const scopeTypeMap = {
    1: "Global",
    2: "Course",
    3: "Session"
  };

  const fetchAttributeDefinitions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await DefinitionServices.getDefinitions();
      if (result.error) {
        console.error("Error fetching definitions:", result.error);
        // TODO: Show error message
      } else {
        // Transform API data to match our component needs
        const transformedDefinitions = result?.data?.map((def) => ({
          key: def.Key,
          attributeId: def.AttributeId,
          displayName: def.DisplayName,
          description: def.Description,
          dataType: def.DataType, // DataType is already a string in the new API response
          allowedScopeTypes: def.AllowedScopeTypes || [], // Handle case where it's already an array of strings
          unit: def.Unit,
          defaultValue: def.DefaultValue,
          isDeletable: def.IsDeletable,
          options: def.Options || []
        }));
        setAttributeDefinitions(transformedDefinitions);
      }
    } catch (error) {
      console.error("Unexpected error fetching definitions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    setOpenViewModal(true);
    fetchAttributeDefinitions();
  }, [fetchAttributeDefinitions]);

  const handleCloseModal = useCallback(() => {
    setOpenViewModal(false);
  }, []);

  return {
    // State
    openViewModal,
    loading,
    attributeDefinitions,

    // Handlers
    handleOpenModal,
    handleCloseModal
  };
};
