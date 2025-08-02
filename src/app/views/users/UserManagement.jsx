import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormHelperText,
  MenuItem,
  Tooltip
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUsers } from "./hooks";

const UserManagement = () => {
  const navigate = useNavigate();

  // Use the custom hook for user management
  const {
    // State
    users,
    loading,
    submitting,
    page,
    rowsPerPage,
    order,
    orderBy,
    searchTerm,
    statusFilter,
    roleFilter,
    availableStatuses,
    availableRoles,

    // Actions
    createUser,
    updateUser,
    deleteUser,

    // Handlers
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleStatusFilterChange,
    handleRoleFilterChange,
    handleResetFilters,
    handleRequestSort,

    // Computed values
    getPaginatedUsers,
    getFilteredCount
  } = useUsers();

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleView = (user) => navigate(`/users/view/${user.UserId}`);

  const handleEdit = (user) => {
    setIsEditMode(true);
    setEditingUserId(user.UserId);
    setFormData({
      email: user.Email || "",
      fullName: user.FullName || "",
      role: user.Role || "",
      password: "" // Don't populate password for edit
    });
    setOpenModal(true);
  };

  const handleDelete = async (userId) => {
    const user = users.find((u) => u.UserId === userId);
    setUserToDelete(user);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    const result = await deleteUser(userToDelete.UserId);
    if (result.success) {
      setConfirmDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setUserToDelete(null);
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingUserId(null);
    setFormData({
      email: "",
      fullName: "",
      role: "",
      password: ""
    });
    setFormErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      email: "",
      fullName: "",
      role: "",
      password: ""
    });
    setFormErrors({});
    setIsEditMode(false);
    setEditingUserId(null);
  };

  const handleFormChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: ""
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.role.trim()) {
      errors.role = "Role is required";
    }

    if (!isEditMode && !formData.password.trim()) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const userData = {
      email: formData.email.trim(),
      fullName: formData.fullName.trim(),
      role: formData.role.trim(),
      ...(formData.password.trim() && { password: formData.password.trim() })
    };

    let result;
    if (isEditMode) {
      result = await updateUser(editingUserId, userData);
    } else {
      result = await createUser(userData);
    }

    if (result.success) {
      handleCloseModal();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const getRoleColor = (role) => {
    switch (role.Id) {
      case 1:
        return "error";
      case 2:
        return "warning";
      case 3:
        return "info";
      default:
        return "default";
    }
  };

  const getRoleName = (role) => {
    console.log(role);
    switch (role.Id) {
      case 1:
        return "Admin";
      case 2:
        return "Lecture";
      case 3:
        return "Student";
      default:
        return "Unknown";
    }
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
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and organize all users in your system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1,
            mt: 1
          }}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ mb: 2, width: "100%", maxWidth: "1400px" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, email, role, or status..."
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
              },
              flex: 1,
              minWidth: "300px"
            }}
          />

          <TextField
            select
            size="small"
            label="Filter by Status"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            sx={{
              minWidth: "150px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px"
              }
            }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {availableStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Filter by Role"
            value={roleFilter}
            onChange={handleRoleFilterChange}
            sx={{
              minWidth: "150px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px"
              }
            }}
          >
            <MenuItem value="">All Roles</MenuItem>
            {availableRoles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            color="inherit"
            onClick={handleResetFilters}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              whiteSpace: "nowrap"
            }}
          >
            Reset Filters
          </Button>
        </Box>

        {(statusFilter || roleFilter || searchTerm) && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                size="small"
                onDelete={() => setSearchTerm("")}
                variant="outlined"
              />
            )}
            {statusFilter && (
              <Chip
                label={`Status: ${statusFilter}`}
                size="small"
                onDelete={() => setStatusFilter("")}
                variant="outlined"
              />
            )}
            {roleFilter && (
              <Chip
                label={`Role: ${roleFilter}`}
                size="small"
                onDelete={() => setRoleFilter("")}
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      <Paper
        sx={{
          width: "100%",
          maxWidth: "1400px",
          overflow: "hidden",
          borderRadius: "20px",
          boxShadow: "none",
          border: "1px solid #e0e0e0"
        }}
      >
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table aria-label="users table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "FullName"}
                    direction={orderBy === "FullName" ? order : "asc"}
                    onClick={() => handleRequestSort("FullName")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                      Full Name
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "Email"}
                    direction={orderBy === "Email" ? order : "asc"}
                    onClick={() => handleRequestSort("Email")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                      Email
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "Role"}
                    direction={orderBy === "Role" ? order : "asc"}
                    onClick={() => handleRequestSort("Role")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BadgeIcon sx={{ mr: 1, fontSize: 20 }} />
                      Role
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "Status"}
                    direction={orderBy === "Status" ? order : "asc"}
                    onClick={() => handleRequestSort("Status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "CreatedAt"}
                    direction={orderBy === "CreatedAt" ? order : "asc"}
                    onClick={() => handleRequestSort("CreatedAt")}
                  >
                    Created Date
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ py: 2, px: 3 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : getFilteredCount() === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm || statusFilter || roleFilter
                        ? "No users found matching the current filters"
                        : "No users found"}
                    </Typography>
                    {(searchTerm || statusFilter || roleFilter) && (
                      <Button
                        variant="text"
                        color="primary"
                        onClick={handleResetFilters}
                        sx={{ mt: 1, textTransform: "none" }}
                      >
                        Clear all filters
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                getPaginatedUsers().map((user) => (
                  <TableRow
                    key={user.UserId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 2, px: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {user.FullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.UserId?.slice(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2">{user.Email}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Chip
                        label={user.Role}
                        variant="outlined"
                        size="small"
                        color={getRoleColor(user.Role)}
                        icon={<BadgeIcon />}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Chip
                        label={user.Status}
                        variant="filled"
                        size="small"
                        color={getStatusColor(user.Status)}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(user.CreatedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2, px: 3 }}>
                      <Tooltip title="View User">
                        <IconButton size="small" color="info" onClick={() => handleView(user)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(user)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(user.UserId)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[3, 5, 10, 25]}
          component="div"
          count={getFilteredCount()}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
        />
      </Paper>

      {/* Add/Edit User Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" component="div">
            {isEditMode ? "Edit User" : "Add New User"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <FormControl fullWidth error={!!formErrors.email}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleFormChange("email")}
                error={!!formErrors.email}
                placeholder="e.g., user@example.com"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  }
                }}
              />
              {formErrors.email && <FormHelperText>{formErrors.email}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.fullName}>
              <TextField
                label="Full Name"
                value={formData.fullName}
                onChange={handleFormChange("fullName")}
                error={!!formErrors.fullName}
                placeholder="e.g., John Doe"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  }
                }}
              />
              {formErrors.fullName && <FormHelperText>{formErrors.fullName}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.role}>
              <TextField
                select
                label="Role"
                value={formData.role}
                onChange={handleFormChange("role")}
                error={!!formErrors.role}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  }
                }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Lecture">Lecture</MenuItem>
                <MenuItem value="Student">Student</MenuItem>
              </TextField>
              {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
            </FormControl>

            {!isEditMode && (
              <FormControl fullWidth error={!!formErrors.password}>
                <TextField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange("password")}
                  error={!!formErrors.password}
                  placeholder="Enter password"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px"
                    }
                  }}
                />
                {formErrors.password && <FormHelperText>{formErrors.password}</FormHelperText>}
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseModal}
            color="inherit"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3
            }}
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditMode ? (
              "Update User"
            ) : (
              "Add User"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" component="div" color="error.main">
            Delete User
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the user <strong>{userToDelete?.FullName}</strong> (
            {userToDelete?.Email})?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCancelDelete}
            color="inherit"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={submitting}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
