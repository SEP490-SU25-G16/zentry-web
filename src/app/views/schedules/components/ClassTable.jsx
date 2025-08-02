// src/app/views/schedules/components/ClassTable.jsx
import React, { useState, useMemo } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Paper,
  Tooltip,
  Chip,
  Box,
  TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const ClassTable = ({ data, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset page when data changes (e.g., when filtering)
  React.useEffect(() => {
    setPage(0);
  }, [data]);

  if (data.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: "20px",
          border: "1px solid #e0e0e0",
          boxShadow: "none"
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No classes found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or filter criteria
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        borderRadius: "20px",
        border: "1px solid #e0e0e0",
        boxShadow: "none",
        overflow: "hidden"
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fafafa" }}>
              <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>Course</TableCell>
              <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>Lecturer</TableCell>
              <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>Section</TableCell>
              <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>Semester</TableCell>
              <TableCell align="center" sx={{ py: 2, px: 3, fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((cls, idx) => (
              <TableRow
                key={cls.id || idx}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "#f8f9fa" }
                }}
              >
                <TableCell sx={{ py: 2, px: 3 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {cls.courseName || "Unknown Course"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <Typography variant="body2">{cls.lecturerName || "Unknown Lecturer"}</Typography>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <Chip label={cls.sectionCode} size="small" variant="outlined" color="secondary" />
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <Chip
                    label={cls.semester}
                    size="small"
                    variant="filled"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ py: 2, px: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/schedules/classes/${cls.id}`)}
                        sx={{ color: "primary.main" }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => onEdit(cls)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => onDelete(cls)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[3, 5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showFirstButton
        showLastButton
        sx={{
          borderTop: "1px solid #e0e0e0",
          "& .MuiTablePagination-toolbar": {
            minHeight: "52px"
          }
        }}
      />
    </Paper>
  );
};

export default ClassTable;
