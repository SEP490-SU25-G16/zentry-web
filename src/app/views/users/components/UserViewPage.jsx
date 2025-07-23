import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box, Button, Paper, Divider, Grid, Chip } from "@mui/material";
import { mockUsers } from "../mock/mockUsers";

const UserViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find((u) => u.UserId.toString() === id);

  if (!user) return <Typography>User not found</Typography>;

  const renderStatusChip = (status) => (
    <Chip
      label={status}
      size="small"
      color={status === "Active" ? "success" : "error"}
      variant="outlined"
    />
  );

  return (
    <Box m={3}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Full Name:</strong> {user.FullName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.Email}
            </Typography>
            <Typography>
              <strong>Role:</strong> {user.Role}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Status:</strong> {renderStatusChip(user.Status)}
            </Typography>
            <Typography>
              <strong>Created At:</strong> {new Date(user.CreatedAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserViewPage;
