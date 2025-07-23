import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Paper,
  Chip,
  TextField,
  Select,
  MenuItem,
  Grid,
  TableSortLabel
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";

const UserTable = ({
  users,
  onView,
  onEdit,
  onDelete,
  onRestore,
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  sortConfig,
  onSortChange
}) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const applyFilters = () => {
    return users
      .filter(
        (u) =>
          u.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.Email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (u) =>
          (!filters.role || u.Role === filters.role) &&
          (!filters.status || u.Status === filters.status)
      );
  };

  const applySort = (filtered) => {
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    onSortChange({ key, direction: isAsc ? "desc" : "asc" });
  };

  const filteredUsers = applySort(applyFilters());
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderStatusChip = (status) => (
    <Chip
      label={status}
      size="small"
      color={status === "Active" ? "success" : "error"}
      variant="outlined"
    />
  );

  return (
    <Paper>
      <Grid container spacing={2} p={2}>
        <Grid item xs={6}>
          <TextField
            label="Search"
            fullWidth
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Select
            fullWidth
            displayEmpty
            value={filters.role}
            onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Lecture">Lecture</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={3}>
          <Select
            fullWidth
            displayEmpty
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "FullName"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("FullName")}
                >
                  Full Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "Email"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("Email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "CreatedAt"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("CreatedAt")}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.UserId}>
                <TableCell>{user.FullName}</TableCell>
                <TableCell>{user.Email}</TableCell>
                <TableCell>{user.Role}</TableCell>
                <TableCell>{renderStatusChip(user.Status)}</TableCell>
                <TableCell>{new Date(user.CreatedAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onView(user)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => onEdit(user)}>
                    <EditIcon />
                  </IconButton>
                  {user.Status === "Active" ? (
                    <IconButton onClick={() => onDelete(user)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => onRestore(user)}>
                      <RestoreIcon color="success" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
      />
    </Paper>
  );
};

export default UserTable;
