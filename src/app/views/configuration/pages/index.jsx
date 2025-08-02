import React from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
  TablePagination
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useAttributeDefinition } from "../hooks/useAttributeDefinition";
import { useSetting } from "../hooks/useSetting";
import { useConfigurationData } from "../hooks/useConfigurationData";
import QuickActionsSection from "../components/QuickActionsSection";
import AttributeDefinitionModal from "../components/AttributeDefinitionModal";
import SettingModal from "../components/SettingModal";
import DefinitionsTable from "../components/DefinitionsTable";
import SettingsTable from "../components/SettingsTable";
import NotificationSnackbar from "../components/NotificationSnackbar";

const ConfigurationPage = () => {
  const {
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
    handleCloseSnackbar
  } = useAttributeDefinition();

  const {
    // Setting State
    openSettingModal,
    submitting: settingSubmitting,
    loading: settingLoading,
    formData: settingFormData,
    formErrors: settingFormErrors,
    attributeDefinitions,

    // Setting Handlers
    handleOpenModal: handleOpenSettingModal,
    handleCloseModal: handleCloseSettingModal,
    handleFormChange: handleSettingFormChange,
    handleSubmit: handleSettingSubmit
  } = useSetting();

  const {
    // Configuration Data State
    loading: dataLoading,
    attributeDefinitions: tableDefinitions,
    settings,
    settingsPagination,
    activeTab,
    page,
    rowsPerPage,
    searchTerm,

    // Computed values
    paginatedDefinitions,
    paginatedSettings,
    currentFilteredCount,

    // Configuration Data Handlers
    handleTabChange,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange
  } = useConfigurationData();

  const handleCreateSetting = () => {
    handleOpenSettingModal();
  };

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        backgroundColor: "white"
      }}
    >
      <Box
        sx={{
          mb: 3,
          mt: 10,
          width: "100%",
          maxWidth: "1400px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Configuration Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system settings and attribute definitions
          </Typography>
        </Box>
      </Box>

      <QuickActionsSection
        onCreateAttributeDefinition={handleOpenModal}
        onCreateSetting={handleCreateSetting}
      />

      {/* Search Bar */}
      <Box sx={{ my: 2, width: "100%", maxWidth: "1400px" }}>
        <TextField
          fullWidth
          size="small"
          placeholder={
            activeTab === 0
              ? "Search by key, display name, description, or data type..."
              : "Search by attribute key, display name, value, or scope type..."
          }
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
          sx={{
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px"
            }
          }}
        />
      </Box>

      {/* Main Content with Tabs */}
      <Paper
        sx={{
          width: "100%",
          maxWidth: "1400px",
          borderRadius: "20px",
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          overflow: "hidden"
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              px: 3,
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500
              }
            }}
          >
            <Tab label="Attribute Definitions" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <DefinitionsTable
              definitions={paginatedDefinitions}
              loading={dataLoading}
              searchTerm={searchTerm}
            />
          )}
          {activeTab === 1 && (
            <SettingsTable
              settings={paginatedSettings}
              loading={dataLoading}
              pagination={settingsPagination}
              searchTerm={searchTerm}
            />
          )}
        </Box>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={currentFilteredCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
          sx={{
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#f8f9fa"
          }}
        />
      </Paper>

      <AttributeDefinitionModal
        open={openAttributeModal}
        onClose={handleCloseModal}
        formData={formData}
        formErrors={formErrors}
        optionInput={optionInput}
        draggedIndex={draggedIndex}
        submitting={submitting}
        onFormChange={handleFormChange}
        onScopeTypesChange={handleScopeTypesChange}
        onDeletableChange={handleDeletableChange}
        onOptionInputChange={handleOptionInputChange}
        onAddOption={handleAddOption}
        onRemoveOption={handleRemoveOption}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onSubmit={handleSubmit}
      />

      <SettingModal
        open={openSettingModal}
        onClose={handleCloseSettingModal}
        formData={settingFormData}
        formErrors={settingFormErrors}
        submitting={settingSubmitting}
        loading={settingLoading}
        attributeDefinitions={attributeDefinitions}
        onFormChange={handleSettingFormChange}
        onSubmit={handleSettingSubmit}
      />

      <NotificationSnackbar snackbar={snackbar} onClose={handleCloseSnackbar} />
    </Box>
  );
};

export default ConfigurationPage;
