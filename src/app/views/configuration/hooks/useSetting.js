import { useState, useEffect } from "react";
import DefinitionServices from "../services/difinition.service";
import SettingServices from "../services/setting.service";

export const useSetting = () => {
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    attributeKey: "",
    scopeType: "",
    scopeId: "",
    value: ""
  });
  const [formErrors, setFormErrors] = useState({});
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

  // Reverse mapping for API calls
  const reverseScopeTypeMap = {
    Global: 1,
    Course: 2,
    Session: 3
  };

  // Fetch attribute definitions when component mounts
  useEffect(() => {
    fetchAttributeDefinitions();
  }, []);

  const fetchAttributeDefinitions = async () => {
    setLoading(true);
    try {
      const result = await DefinitionServices.getDefinitions();
      console.log(result);
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
  };

  const handleOpenModal = () => {
    setOpenSettingModal(true);
  };

  const handleCloseModal = () => {
    setOpenSettingModal(false);
    setFormData({
      attributeKey: "",
      scopeType: "",
      scopeId: "",
      value: ""
    });
    setFormErrors({});
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: ""
      }));
    }

    // Reset scopeType when attributeKey changes
    if (field === "attributeKey") {
      setFormData((prev) => ({
        ...prev,
        scopeType: "",
        value: ""
      }));
    }

    // Set default value when attribute changes
    if (field === "attributeKey") {
      const selectedDefinition = attributeDefinitions.find((def) => def.key === value);
      if (selectedDefinition) {
        let defaultValue = selectedDefinition.defaultValue;

        // For Selection type, ensure the default value is a valid option
        if (selectedDefinition.dataType === "Selection") {
          const validOptions = selectedDefinition.options?.map((option) => option.Value) || [];
          if (!validOptions.includes(defaultValue)) {
            // If default value is not valid, use the first available option or empty string
            defaultValue = validOptions.length > 0 ? validOptions[0] : "";
          }
        }

        setFormData((prev) => ({
          ...prev,
          value: defaultValue
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.attributeKey.trim()) {
      errors.attributeKey = "Attribute definition is required";
    }

    if (!formData.scopeType.trim()) {
      errors.scopeType = "Scope type is required";
    }

    // Validate ScopeId based on ScopeType
    if (formData.scopeType) {
      if (formData.scopeType === "Global") {
        // For Global scope, ScopeId can be null, empty, or empty GUID
        // No validation needed as backend will handle conversion
      } else {
        // For non-Global scopes (Course, Session), ScopeId is optional
        // Database uses numeric IDs (Global=1, Course=2, Session=3) and will auto-generate/map as needed
        // No specific format validation required
      }
    }

    if (!formData.value.trim()) {
      errors.value = "Value is required";
    }

    // Validate scope type is allowed for selected attribute
    const selectedDefinition = attributeDefinitions.find(
      (def) => def.key === formData.attributeKey
    );
    if (
      selectedDefinition &&
      formData.scopeType &&
      !selectedDefinition.allowedScopeTypes.includes(formData.scopeType)
    ) {
      errors.scopeType = "This scope type is not allowed for the selected attribute";
    }

    // Validate value based on data type
    if (selectedDefinition && formData.value.trim()) {
      const dataType = selectedDefinition.dataType;
      const value = formData.value.trim();

      switch (dataType) {
        case "Int":
          if (!/^-?\d+$/.test(value)) {
            errors.value = "Value must be a valid integer";
          }
          break;
        case "Decimal":
          if (!/^-?\d*\.?\d+$/.test(value)) {
            errors.value = "Value must be a valid decimal number";
          }
          break;
        case "Boolean":
          if (!["true", "false"].includes(value.toLowerCase())) {
            errors.value = "Value must be true or false";
          }
          break;
        case "Date":
          if (isNaN(Date.parse(value))) {
            errors.value = "Value must be a valid date";
          }
          break;
        case "Json":
          try {
            JSON.parse(value);
          } catch (e) {
            errors.value = "Value must be a valid JSON string";
          }
          break;
        case "Selection":
          const validOptions = selectedDefinition.options?.map((option) => option.Value) || [];
          if (validOptions.length > 0 && !validOptions.includes(value)) {
            errors.value = "Value must be one of the available options";
          }
          break;
        // String type doesn't need additional validation
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Prepare the data exactly as specified in the JSON structure
      const settingData = {
        attributeKey: formData.attributeKey,
        scopeType: formData.scopeType,
        scopeId:
          formData.scopeType === "Global"
            ? formData.scopeId.trim() || null
            : formData.scopeId.trim(),
        value: formData.value.trim()
      };

      console.log("Creating setting:", settingData);

      // Call API to create setting
      const result = await SettingServices.createSetting(settingData);

      if (result.error) {
        console.error("API Error:", result.error);

        // Set specific field errors based on the error message
        if (result.error.includes("ScopeId")) {
          setFormErrors((prev) => ({
            ...prev,
            scopeId: result.error
          }));
        } else if (result.error.includes("GUID")) {
          setFormErrors((prev) => ({
            ...prev,
            scopeId: result.error
          }));
        } else if (result.error.includes("data type")) {
          setFormErrors((prev) => ({
            ...prev,
            value: result.error
          }));
        }

        // TODO: Show error message in snackbar
        // showSnackbar(result.error, "error");
      } else {
        console.log("Setting created successfully:", result.data);
        handleCloseModal();
        // TODO: Show success message and refresh data
        // showSnackbar("Setting created successfully!", "success");
        // refreshData();
      }
    } catch (error) {
      console.error("Unexpected error creating setting:", error);
      // TODO: Show error message
      // showSnackbar("An unexpected error occurred. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // State
    openSettingModal,
    submitting,
    loading,
    formData,
    formErrors,
    attributeDefinitions,

    // Handlers
    handleOpenModal,
    handleCloseModal,
    handleFormChange,
    handleSubmit,
    fetchAttributeDefinitions
  };
};
