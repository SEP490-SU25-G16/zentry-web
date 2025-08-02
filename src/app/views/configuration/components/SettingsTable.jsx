import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Tooltip
} from "@mui/material";

const SettingsTable = ({ settings, loading, pagination, searchTerm }) => {
  const getScopeTypeColor = (scopeType) => {
    const colors = {
      Global: "primary",
      Course: "secondary",
      Session: "success"
    };
    return colors[scopeType] || "default";
  };

  const getDataTypeColor = (dataType) => {
    const colors = {
      String: "primary",
      Int: "secondary",
      Boolean: "success",
      Decimal: "warning",
      Date: "info",
      Json: "error",
      Selection: "default"
    };
    return colors[dataType] || "default";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatScopeId = (scopeId) => {
    if (!scopeId || scopeId === "00000000-0000-0000-0000-000000000000") {
      return "N/A";
    }
    return scopeId.substring(0, 8) + "...";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (settings.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {searchTerm ? `No settings found matching "${searchTerm}"` : "No settings found."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Attribute Key</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Display Name</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Data Type</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Scope Type</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Scope ID</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Value</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {settings.map((setting, index) => (
              <TableRow key={setting.id || index} hover>
                <TableCell sx={{ padding: "16px" }}>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 500 }}>
                    {setting.attributeKey}
                  </Typography>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {setting.attributeDisplayName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Chip
                    label={setting.dataType}
                    color={getDataTypeColor(setting.dataType)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Chip
                    label={setting.scopeType}
                    color={getScopeTypeColor(setting.scopeType)}
                    size="small"
                    variant="filled"
                  />
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Tooltip title={setting.scopeId}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {formatScopeId(setting.scopeId)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {setting.value}
                  </Typography>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(setting.updatedAt)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SettingsTable;
