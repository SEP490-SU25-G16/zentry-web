import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserServices from "services/user.service";

const UserViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await UserServices.getUserById(id);
      setUser(res.data?.Data || null);
      setLoading(false);
    };
    fetchUser();
   
  }, [id]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress />
  </Box>;

  if (!user) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <Typography variant="h5" fontWeight={700} gutterBottom>
      User not found
    </Typography>
  </Box>;

  const renderStatusChip = (status) => (
    <Chip
      label={status}
      size="small"
      color={status === "Active" ? "success" : "error"}
      variant="outlined"
    />
  );

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <Tooltip title="Quay lại">
            <IconButton color="inherit" onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" fontWeight={700} sx={{ ml: 1 }}>
            User Details
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={3}
        >
          <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 32 }}>
            {getInitials(user?.FullName)}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {user.FullName}
            </Typography>
            <Typography color="text.secondary">{user.Email}</Typography>
            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              <Chip label={user.Role} color="info" variant="outlined" size="small" />
              {renderStatusChip(user.Status)}
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Full Name:</strong> {user.FullName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.Email}
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
      </Paper>
    </Container>
  );
};

export default UserViewPage;
