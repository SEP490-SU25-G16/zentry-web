import React from "react";
import { Paper, Typography, Grid, Button } from "@mui/material";
import { Settings as SettingsIcon, List as ListIcon } from "@mui/icons-material";

const QuickActionsSection = ({ onCreateAttributeDefinition, onCreateSetting }) => {
  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: "1400px",
        p: 4,
        borderRadius: "20px",
        boxShadow: "none",
        border: "1px solid #e0e0e0"
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<ListIcon />}
            onClick={onCreateAttributeDefinition}
            sx={{
              py: 2,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "1.1rem",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0"
              }
            }}
          >
            Create Attribute Definition
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<SettingsIcon />}
            onClick={onCreateSetting}
            sx={{
              py: 2,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "1.1rem",
              backgroundColor: "#2e7d32",
              "&:hover": {
                backgroundColor: "#1b5e20"
              }
            }}
          >
            Create Setting
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuickActionsSection;
