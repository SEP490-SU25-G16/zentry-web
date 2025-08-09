import { Box, Button, Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserServices from "services/user.service";

const UserViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await UserServices.getUserById(id);
      setUser(res.data?.Data || null);
    };
    fetchUser();
   
  }, [id]);

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
