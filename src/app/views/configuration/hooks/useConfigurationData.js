import { useState, useEffect, useCallback, useMemo } from "react";
import DefinitionServices from "../services/difinition.service";
import SettingServices from "../services/setting.service";

export const useConfigurationData = () => {
  const [loading, setLoading] = useState(false);
  const [attributeDefinitions, setAttributeDefinitions] = useState([]);
  const [settings, setSettings] = useState([]);
  const [settingsPagination, setSettingsPagination] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 for definitions, 1 for settings

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter data based on search term
  const filteredDefinitions = useMemo(() => {
    if (!searchTerm) return attributeDefinitions;

    const term = searchTerm.toLowerCase();
    return attributeDefinitions.filter(
      (def) =>
        def.key?.toLowerCase().includes(term) ||
        def.displayName?.toLowerCase().includes(term) ||
        def.description?.toLowerCase().includes(term) ||
        def.dataType?.toLowerCase().includes(term)
    );
  }, [attributeDefinitions, searchTerm]);

  const filteredSettings = useMemo(() => {
    if (!searchTerm) return settings;

    const term = searchTerm.toLowerCase();
    return settings.filter(
      (setting) =>
        setting.attributeKey?.toLowerCase().includes(term) ||
        setting.attributeDisplayName?.toLowerCase().includes(term) ||
        setting.value?.toLowerCase().includes(term) ||
        setting.scopeType?.toLowerCase().includes(term)
    );
  }, [settings, searchTerm]);

  // Paginated data
  const paginatedDefinitions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredDefinitions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDefinitions, page, rowsPerPage]);

  const paginatedSettings = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredSettings.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSettings, page, rowsPerPage]);

  // Get current filtered count
  const currentFilteredCount =
    activeTab === 0 ? filteredDefinitions.length : filteredSettings.length;

  const fetchAttributeDefinitions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await DefinitionServices.getDefinitions();
      if (result.error) {
        console.error("Error fetching definitions:", result.error);
      } else {
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

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const result = await SettingServices.getSettings();
      if (result.error) {
        console.error("Error fetching settings:", result.error);
      } else {
        // Transform settings data
        const transformedSettings = result.data.map((setting) => ({
          id: setting.Id,
          attributeId: setting.AttributeId,
          attributeKey: setting.AttributeKey,
          attributeDisplayName: setting.AttributeDisplayName,
          dataType: setting.DataType,
          scopeType: setting.ScopeType,
          scopeId: setting.ScopeId,
          value: setting.Value,
          createdAt: setting.CreatedAt,
          updatedAt: setting.UpdatedAt
        }));
        setSettings(transformedSettings);
        setSettingsPagination(result.pagination);
      }
    } catch (error) {
      console.error("Unexpected error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    if (activeTab === 0) {
      fetchAttributeDefinitions();
    } else {
      fetchSettings();
    }
  }, [activeTab, fetchAttributeDefinitions, fetchSettings]);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
    setPage(0); // Reset to first page when switching tabs
    setSearchTerm(""); // Clear search when switching tabs
  }, []);

  // Pagination handlers
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Search handler
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  }, []);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    // State
    loading,
    attributeDefinitions,
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

    // Handlers
    handleTabChange,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    refreshData,
    fetchSettings
  };
};
