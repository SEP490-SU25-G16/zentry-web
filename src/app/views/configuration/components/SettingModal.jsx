import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Typography,
  Button,
  Box,
  Grid
} from "@mui/material";

const SettingModal = ({
  open,
  onClose,
  formData,
  formErrors,
  submitting,
  loading,
  attributeDefinitions,
  onFormChange,
  onSubmit
}) => {
  const scopeTypes = ["Global", "Course", "Session"];

  const selectedDefinition = attributeDefinitions.find((def) => def.key === formData.attributeKey);

  const renderValueInput = () => {
    if (!selectedDefinition) {
      return (
        <TextField
          label="Value"
          value={formData.value}
          onChange={onFormChange("value")}
          error={!!formErrors.value}
          placeholder="Enter value"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px"
            }
          }}
        />
      );
    }

    // Handle different data types
    switch (selectedDefinition.dataType) {
      case "Boolean":
        return (
          <FormControl fullWidth>
            <InputLabel>Value</InputLabel>
            <Select
              value={formData.value}
              onChange={onFormChange("value")}
              label="Value"
              sx={{
                borderRadius: "8px"
              }}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
        );

      case "Selection":
        return (
          <FormControl fullWidth>
            <InputLabel>Value</InputLabel>
            <Select
              value={formData.value}
              onChange={onFormChange("value")}
              label="Value"
              sx={{
                borderRadius: "8px"
              }}
            >
              {!formData.value && (
                <MenuItem value="" disabled>
                  Select an option...
                </MenuItem>
              )}
              {selectedDefinition.options
                ?.sort((a, b) => a.SortOrder - b.SortOrder)
                ?.map((option) => (
                  <MenuItem key={option.Id} value={option.Value}>
                    {option.DisplayLabel}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        );

      case "Int":
        return (
          <TextField
            label="Value"
            type="number"
            value={formData.value}
            onChange={onFormChange("value")}
            error={!!formErrors.value}
            placeholder="Enter number"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px"
              }
            }}
          />
        );

      case "Decimal":
        return (
          <TextField
            label="Value"
            type="number"
            inputProps={{ step: "0.01" }}
            value={formData.value}
            onChange={onFormChange("value")}
            error={!!formErrors.value}
            placeholder="Enter decimal number"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px"
              }
            }}
          />
        );

      case "Date":
        return (
          <TextField
            label="Value"
            type="date"
            value={formData.value}
            onChange={onFormChange("value")}
            error={!!formErrors.value}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px"
              }
            }}
          />
        );

      case "Json":
        return (
          <TextField
            label="Value"
            multiline
            rows={4}
            value={formData.value}
            onChange={onFormChange("value")}
            error={!!formErrors.value}
            placeholder="Enter JSON object"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px"
              }
            }}
          />
        );

      default: // String
        return (
          <TextField
            label="Value"
            value={formData.value}
            onChange={onFormChange("value")}
            error={!!formErrors.value}
            placeholder="Enter value"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px"
              }
            }}
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h6" component="div">
          Create Setting
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.attributeKey}>
                <InputLabel>Attribute Definition</InputLabel>
                <Select
                  value={formData.attributeKey}
                  onChange={onFormChange("attributeKey")}
                  label="Attribute Definition"
                  disabled={loading}
                  sx={{
                    borderRadius: "8px"
                  }}
                >
                  {loading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading definitions...
                    </MenuItem>
                  ) : (
                    attributeDefinitions.map((definition) => (
                      <MenuItem key={definition.key} value={definition.key}>
                        {definition.displayName} ({definition.key})
                      </MenuItem>
                    ))
                  )}
                </Select>
                {formErrors.attributeKey && (
                  <FormHelperText>{formErrors.attributeKey}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.scopeType}>
                <InputLabel>Scope Type</InputLabel>
                <Select
                  value={formData.scopeType}
                  onChange={onFormChange("scopeType")}
                  label="Scope Type"
                  sx={{
                    borderRadius: "8px"
                  }}
                >
                  {scopeTypes
                    .filter(
                      (type) =>
                        !selectedDefinition || selectedDefinition.allowedScopeTypes.includes(type)
                    )
                    .map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                </Select>
                {formErrors.scopeType && <FormHelperText>{formErrors.scopeType}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.scopeId}>
                <TextField
                  label="Scope ID"
                  value={formData.scopeId}
                  onChange={onFormChange("scopeId")}
                  error={!!formErrors.scopeId}
                  placeholder={
                    formData.scopeType === "Global"
                      ? "Leave empty for Global scope"
                      : "Enter scope identifier (optional)"
                  }
                  helperText={
                    formErrors.scopeId ||
                    (formData.scopeType === "Global"
                      ? "Optional for Global scope"
                      : formData.scopeType
                      ? `Optional: Scope identifier for ${formData.scopeType}`
                      : "Optional: Depends on selected scope type")
                  }
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px"
                    }
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.value}>
                {renderValueInput()}
                {formErrors.value && <FormHelperText>{formErrors.value}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Display selected definition info */}
            {selectedDefinition && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Definition Info:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Display Name:</strong> {selectedDefinition.displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Description:</strong> {selectedDefinition.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Data Type:</strong> {selectedDefinition.dataType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Default Value:</strong> {selectedDefinition.defaultValue}
                  </Typography>
                  {selectedDefinition.unit && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Unit:</strong> {selectedDefinition.unit}
                    </Typography>
                  )}
                  {selectedDefinition.dataType === "Selection" &&
                    selectedDefinition.options?.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Available Options:</strong>{" "}
                        {selectedDefinition.options
                          .sort((a, b) => a.SortOrder - b.SortOrder)
                          .map((option) => option.DisplayLabel)
                          .join(", ")}
                      </Typography>
                    )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3
          }}
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : "Create Setting"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingModal;
