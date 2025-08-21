import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useState } from "react";

const mockDefinitions = [
  {
    key: "firstName",
    displayName: "First Name",
    dataType: "String",
    allowedScopeTypes: ["User", "Profile"],
    defaultValue: "",
    description: "The given name of the user.",
    isDeletable: true
  },
  {
    key: "age",
    displayName: "Age",
    dataType: "Int",
    allowedScopeTypes: ["User"],
    defaultValue: 18,
    unit: "years",
    description: "Age of the user in years.",
    isDeletable: true
  },
  {
    key: "isActive",
    displayName: "Active Status",
    dataType: "Boolean",
    allowedScopeTypes: ["User", "Admin"],
    defaultValue: true,
    description: "Whether the user is active.",
    isDeletable: false
  },
  {
    key: "salary",
    displayName: "Monthly Salary",
    dataType: "Decimal",
    allowedScopeTypes: ["Employee"],
    defaultValue: 1000.5,
    unit: "USD",
    description: "The monthly salary of the employee.",
    isDeletable: true
  },
  {
    key: "gender",
    displayName: "Gender",
    dataType: "Selection",
    allowedScopeTypes: ["User", "Profile"],
    defaultValue: "M",
    description: "Gender of the user.",
    isDeletable: true,
    options: [
      { value: "M", displayLabel: "Male" },
      { value: "F", displayLabel: "Female" },
      { value: "O", displayLabel: "Other" }
    ]
  }
];

const DefinitionsTable = ({ definitions, loading, searchTerm, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const openConfirm = (definition) => {
    setPendingDelete(definition);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await onDelete?.(pendingDelete);
    closeConfirm();
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // if (definitions.length === 0) {
  //   return (
  //     <Box sx={{ textAlign: "center", py: 4 }}>
  //       <Typography variant="body1" color="text.secondary">
  //         {searchTerm
  //           ? `No attribute definitions found matching "${searchTerm}"`
  //           : "No attribute definitions found."}
  //       </Typography>
  //     </Box>
  //   );
  // }

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
              <TableCell sx={{ fontWeight: 600, padding: "16px", width: 120 }}>Actions</TableCell>
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
                <TableCell sx={{ padding: "16px" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={() => onEdit?.(definition)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openConfirm(definition)}
                      disabled={definition.isDeletable === false}
                      title={
                        definition.isDeletable === false
                          ? "This definition cannot be deleted"
                          : "Delete"
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Show detailed cards for Selection type definitions */}
      {mockDefinitions
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

      <Dialog open={confirmOpen} onClose={closeConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete definition "{pendingDelete?.displayName}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DefinitionsTable;
