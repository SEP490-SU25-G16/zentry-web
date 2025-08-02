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
  Card,
  CardContent,
  Grid
} from "@mui/material";

const DefinitionsTable = ({ definitions, loading, searchTerm }) => {
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (definitions.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {searchTerm
            ? `No attribute definitions found matching "${searchTerm}"`
            : "No attribute definitions found."}
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
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Key</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Display Name</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Data Type</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Allowed Scopes</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Default Value</TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "16px" }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {definitions.map((definition, index) => (
              <TableRow key={definition.key || index} hover>
                <TableCell sx={{ padding: "16px" }}>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 500 }}>
                    {definition.key}
                  </Typography>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {definition.displayName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Chip
                    label={definition.dataType}
                    color={getDataTypeColor(definition.dataType)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {definition.allowedScopeTypes?.map((scope) => (
                      <Chip
                        key={scope}
                        label={scope}
                        size="small"
                        variant="outlined"
                        color="default"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Typography variant="body2" color="text.secondary">
                    {definition.defaultValue || "N/A"}
                    {definition.unit && ` ${definition.unit}`}
                  </Typography>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                    {definition.description}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Show detailed cards for Selection type definitions */}
      {definitions
        .filter((def) => def.dataType === "Selection" && def.options?.length > 0)
        .map((definition) => (
          <Card key={`selection-${definition.key}`} sx={{ mt: 3, border: "1px solid #e0e0e0" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Selection Options for "{definition.displayName}"
              </Typography>
              <Grid container spacing={1}>
                {definition.options.map((option, optionIndex) => (
                  <Grid item key={optionIndex}>
                    <Chip
                      label={`${option.displayLabel} (${option.value})`}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        ))}
    </Box>
  );
};

export default DefinitionsTable;
