import { useState } from "react";
import DefinitionServices from "../services/difinition.service";

export const useAttributeDefinition = () => {
  const [openAttributeModal, setOpenAttributeModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [formData, setFormData] = useState({
    key: "",
    displayName: "",
    description: "",
    dataType: "",
    allowedScopeTypes: [],
    unit: "",
    defaultValue: "",
    isDeletable: true,
    options: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [optionInput, setOptionInput] = useState({
    value: "",
    displayLabel: ""
  });
  const [draggedIndex, setDraggedIndex] = useState(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  const handleOpenModal = () => {
    setOpenAttributeModal(true);
  };

  const handleCloseModal = () => {
    setOpenAttributeModal(false);
    setFormData({
      key: "",
      displayName: "",
      description: "",
      dataType: "",
      allowedScopeTypes: [],
      unit: "",
      defaultValue: "",
      isDeletable: true,
      options: []
    });
    setFormErrors({});
    setOptionInput({
      value: "",
      displayLabel: ""
    });
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

    // Reset options when data type changes from Selection to something else
    if (field === "dataType" && formData.dataType === "Selection" && value !== "Selection") {
      setFormData((prev) => ({
        ...prev,
        options: []
      }));
    }
  };

  const handleScopeTypesChange = (event) => {
    const value =
      typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value;
    setFormData((prev) => ({
      ...prev,
      allowedScopeTypes: value
    }));
  };

  const handleDeletableChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      isDeletable: event.target.checked
    }));
  };

  const handleOptionInputChange = (field) => (event) => {
    setOptionInput((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAddOption = () => {
    if (!optionInput.value.trim() || !optionInput.displayLabel.trim()) {
      return;
    }

    const newOption = {
      value: optionInput.value.trim(),
      displayLabel: optionInput.displayLabel.trim(),
      sortOrder: formData.options.length + 1
    };

    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, newOption]
    }));

    setOptionInput({
      value: "",
      displayLabel: ""
    });
  };

  const handleRemoveOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options
        .filter((_, i) => i !== index)
        .map((option, i) => ({
          ...option,
          sortOrder: i + 1
        }))
    }));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    setFormData((prev) => {
      const newOptions = [...prev.options];
      const draggedOption = newOptions[draggedIndex];

      // Remove the dragged item
      newOptions.splice(draggedIndex, 1);

      // Insert at new position
      newOptions.splice(dropIndex, 0, draggedOption);

      // Update sort orders
      const updatedOptions = newOptions.map((option, index) => ({
        ...option,
        sortOrder: index + 1
      }));

      return {
        ...prev,
        options: updatedOptions
      };
    });

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.key.trim()) {
      errors.key = "Key is required";
    } else if (!/^[A-Z_]+$/.test(formData.key)) {
      errors.key = "Key must contain only uppercase letters and underscores";
    }

    if (!formData.displayName.trim()) {
      errors.displayName = "Display name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.dataType) {
      errors.dataType = "Data type is required";
    }

    if (formData.allowedScopeTypes.length === 0) {
      errors.allowedScopeTypes = "At least one scope type is required";
    }

    if (!formData.defaultValue.trim()) {
      errors.defaultValue = "Default value is required";
    }

    // Validate options for Selection data type
    if (formData.dataType === "Selection") {
      if (formData.options.length === 0) {
        errors.options = "At least one option is required for Selection data type";
      } else if (
        formData.defaultValue &&
        !formData.options.some((option) => option.value === formData.defaultValue)
      ) {
        errors.defaultValue = "Default value must match one of the option values";
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
      // Prepare the data
      const attributeDefinition = {
        ...formData,
        unit: formData.unit.trim() || null,
        defaultValue:
          formData.dataType === "Boolean"
            ? formData.defaultValue.toLowerCase() === "true"
            : formData.defaultValue
      };

      // Only include options if dataType is Selection
      if (formData.dataType !== "Selection") {
        delete attributeDefinition.options;
      }

      console.log("Creating attribute definition:", attributeDefinition);

      // Call API to create attribute definition
      const result = await DefinitionServices.createDefinition(attributeDefinition);

      if (result.error) {
        // Handle API error
        console.error("API Error:", result.error);
        showSnackbar(
          typeof result.error === "string"
            ? result.error
            : result.error.message || "Failed to create attribute definition",
          "error"
        );
      } else {
        // Success
        console.log("Definition created successfully:", result.data);
        showSnackbar("Attribute definition created successfully!", "success");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      showSnackbar("An unexpected error occurred. Please try again.", "error");
    } finally {
      setSubmitting(false);
      window.location.reload();
    }
  };

  return {
    // State
    openAttributeModal,
    submitting,
    snackbar,
    formData,
    formErrors,
    optionInput,
    draggedIndex,

    // Handlers
    handleOpenModal,
    handleCloseModal,
    handleFormChange,
    handleScopeTypesChange,
    handleDeletableChange,
    handleOptionInputChange,
    handleAddOption,
    handleRemoveOption,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDrop,
    handleDragEnd,
    handleSubmit,
    handleCloseSnackbar,
    showSnackbar
  };
};
