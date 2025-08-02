import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { Visibility as VisibilityIcon, Close as CloseIcon } from "@mui/icons-material";

const ViewDefinitionsModal = ({ open, onClose, loading, attributeDefinitions }) => {
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          p: 1,
          maxHeight: "90vh"
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <VisibilityIcon color="primary" />
          <Typography variant="h6" component="div">
            All Attribute Definitions
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ pt: 1 }}>
            {attributeDefinitions.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No attribute definitions found.
                </Typography>
              </Box>
            ) : (
              <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Key</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Display Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Data Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Allowed Scopes</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Default Value</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attributeDefinitions.map((definition, index) => (
                      <TableRow key={definition.key || index} hover>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: "monospace", fontWeight: 500 }}
                          >
                            {definition.key}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {definition.displayName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={definition.dataType}
                            color={getDataTypeColor(definition.dataType)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
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
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {definition.defaultValue || "N/A"}
                            {definition.unit && ` ${definition.unit}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                            {definition.description}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Show detailed cards for Selection type definitions */}
            {attributeDefinitions
              .filter((def) => def.dataType === "Selection" && def.options?.length > 0)
              .map((definition) => (
                <Card
                  key={`selection-${definition.key}`}
                  sx={{ mt: 3, border: "1px solid #e0e0e0" }}
                >
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
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDefinitionsModal;
