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
  Chip,
  OutlinedInput,
  FormControlLabel,
  Switch,
  CircularProgress,
  Typography,
  Button,
  Box,
  Grid,
  Divider
} from "@mui/material";
import SelectionOptionsSection from "./SelectionOptionsSection";

const AttributeDefinitionModal = ({
  open,
  onClose,
  formData,
  formErrors,
  optionInput,
  draggedIndex,
  submitting,
  onFormChange,
  onScopeTypesChange,
  onDeletableChange,
  onOptionInputChange,
  onAddOption,
  onRemoveOption,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDrop,
  onDragEnd,
  onSubmit
}) => {
  const dataTypes = [
    { id: 1, name: "String" },
    { id: 2, name: "Int" },
    { id: 3, name: "Boolean" },
    { id: 4, name: "Decimal" },
    { id: 5, name: "Date" },
    { id: 6, name: "Json" },
    { id: 7, name: "Selection" }
  ];
  const scopeTypes = ["Global", "Course", "Session"];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
          Create Attribute Definition
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.key}>
                <TextField
                  label="Key"
                  value={formData.key}
                  onChange={onFormChange("key")}
                  error={!!formErrors.key}
                  placeholder="e.g., ALLOW_MANUAL_ADJUSTMENT"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px"
                    }
                  }}
                />
                {formErrors.key && <FormHelperText>{formErrors.key}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.displayName}>
                <TextField
                  label="Display Name"
                  value={formData.displayName}
                  onChange={onFormChange("displayName")}
                  error={!!formErrors.displayName}
                  placeholder="e.g., Cho phép điều chỉnh thủ công"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px"
                    }
                  }}
                />
                {formErrors.displayName && (
                  <FormHelperText>{formErrors.displayName}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.description}>
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={onFormChange("description")}
                  error={!!formErrors.description}
                  placeholder="e.g., Cho phép giáo viên điều chỉnh điểm danh thủ công sau phiên học."
                  fullWidth
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px"
                    }
                  }}
                />
                {formErrors.description && (
                  <FormHelperText>{formErrors.description}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.dataType}>
                <InputLabel>Data Type</InputLabel>
                <Select
                  value={formData.dataType}
                  onChange={onFormChange("dataType")}
                  label="Data Type"
                  sx={{
                    borderRadius: "8px"
                  }}
                >
                  {dataTypes.map((type) => (
                    <MenuItem key={type.id} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.dataType && <FormHelperText>{formErrors.dataType}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.allowedScopeTypes}>
                <InputLabel>Allowed Scope Types</InputLabel>
                <Select
                  multiple
                  value={formData.allowedScopeTypes}
                  onChange={onScopeTypesChange}
                  input={<OutlinedInput label="Allowed Scope Types" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  sx={{
                    borderRadius: "8px"
                  }}
                >
                  {scopeTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.allowedScopeTypes && (
                  <FormHelperText>{formErrors.allowedScopeTypes}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label="Unit (Optional)"
                  value={formData.unit}
                  onChange={onFormChange("unit")}
                  placeholder="e.g., minutes, hours, etc."
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px"
                    }
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.defaultValue}>
                {formData.dataType === "Selection" && formData.options.length > 0 ? (
                  <>
                    <InputLabel>Default Value</InputLabel>
                    <Select
                      value={formData.defaultValue}
                      onChange={onFormChange("defaultValue")}
                      label="Default Value"
                      sx={{
                        borderRadius: "8px"
                      }}
                    >
                      {formData.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.displayLabel}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                ) : (
                  <TextField
                    label="Default Value"
                    value={formData.defaultValue}
                    onChange={onFormChange("defaultValue")}
                    error={!!formErrors.defaultValue}
                    placeholder={
                      formData.dataType === "Boolean"
                        ? "true or false"
                        : formData.dataType === "Date"
                        ? "YYYY-MM-DD format"
                        : formData.dataType === "Json"
                        ? '{"key": "value"}'
                        : formData.dataType === "Decimal"
                        ? "0.00"
                        : "Default value"
                    }
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px"
                      }
                    }}
                  />
                )}
                {formErrors.defaultValue && (
                  <FormHelperText>{formErrors.defaultValue}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Selection Options Section */}
            {formData.dataType === "Selection" && (
              <SelectionOptionsSection
                formData={formData}
                formErrors={formErrors}
                optionInput={optionInput}
                draggedIndex={draggedIndex}
                onOptionInputChange={onOptionInputChange}
                onAddOption={onAddOption}
                onRemoveOption={onRemoveOption}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              />
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDeletable}
                    onChange={onDeletableChange}
                    color="primary"
                  />
                }
                label="Is Deletable"
                sx={{ mt: 1 }}
              />
            </Grid>
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
          {submitting ? <CircularProgress size={20} color="inherit" /> : "Create Definition"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttributeDefinitionModal;
