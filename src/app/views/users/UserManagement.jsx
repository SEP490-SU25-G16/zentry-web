import React, { useState } from "react";
import { Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserTable from "./components/UserTable";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";
import { mockUsers } from "./mock/mockUsers";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Search, Filter, Sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ role: "", status: "" });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleView = (user) => navigate(`/users/view/${user.UserId}`);
  const handleEdit = (user) => navigate(`/users/edit/${user.UserId}`);
  const handleCreate = () => navigate(`/users/edit`);

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleRestore = (user) => {
    const updated = users.map((u) => (u.UserId === user.UserId ? { ...u, Status: "Active" } : u));
    setUsers(updated);
  };

  const confirmDelete = (user) => {
    const updated = users.map((u) => (u.UserId === user.UserId ? { ...u, Status: "Inactive" } : u));
    setUsers(updated);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilters({ role: "", status: "" });
    setSortConfig({ key: "", direction: "asc" });
  };

  return (
    <Box className="m-sm-30">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" mb={2}>
          User Management
        </Typography>

        <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Create User
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => alert("Importing feature is updating...")}
          >
            Import from File
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleReset}>
            Reset Filters
          </Button>
        </Box>

        <UserTable
          users={users}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          searchTerm={searchTerm}
          filters={filters}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilters}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
        />
      </Paper>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        user={selectedUser}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default UserManagement;
