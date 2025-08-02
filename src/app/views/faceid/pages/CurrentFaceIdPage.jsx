import React, { useState, useEffect } from "react";
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
  Chip,
  CircularProgress,
  TextField,
  InputAdornment
} from "@mui/material";
import { Person as PersonIcon, Search as SearchIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { mockFaceIdCurrent } from "../mock/mockFaceIdCurrent";

const PAGE_SIZE = 5;

const CurrentFaceIdPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  // states
  const [faceIds, setFaceIds] = useState([]);
  console.log(faceIds);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("userId");
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFaceIds();
  }, []);

  const fetchFaceIds = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    try {
      // Simulate API call - replace with actual API call
      const response = mockFaceIdCurrent;
      setFaceIds(response);
      setTotalCount(response.length);
    } catch (error) {
      console.error("Error fetching face IDs:", error);
      enqueueSnackbar("Failed to fetch face IDs", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0); // Reset to first page when sorting
  };

  const compareValues = (a, b, orderBy) => {
    let valueA = a[orderBy];
    let valueB = b[orderBy];

    // Handle special cases for specific fields
    if (orderBy === "userId") {
      valueA = valueA?.toLowerCase() || "";
      valueB = valueB?.toLowerCase() || "";
    }

    if (orderBy === "registeredAt" || orderBy === "updatedAt") {
      valueA = new Date(valueA || 0);
      valueB = new Date(valueB || 0);
    }

    if (valueA < valueB) {
      return order === "asc" ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  };

  const getSortedAndFilteredFaceIds = () => {
    let filteredFaceIds = faceIds;

    // Apply search filter
    if (searchTerm.trim()) {
      filteredFaceIds = faceIds.filter((faceId) =>
        faceId.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    return filteredFaceIds.sort((a, b) => compareValues(a, b, orderBy));
  };

  const getPaginatedFaceIds = () => {
    const sortedAndFilteredFaceIds = getSortedAndFilteredFaceIds();
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedAndFilteredFaceIds.slice(startIndex, endIndex);
  };

  const getFilteredCount = () => {
    return getSortedAndFilteredFaceIds().length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Registered":
        return "success";
      case "Not yet":
        return "warning";
      default:
        return "default";
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
            Current Face ID Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor all registered Face IDs in your system
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mb: 2
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by User ID..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Paper
        sx={{
          width: "100%",
          maxWidth: "1400px",
          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          border: "1px solid #e0e0e0"
        }}
      >
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table aria-label="face ids table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === "userId"}
                    direction={orderBy === "userId" ? order : "asc"}
                    onClick={() => handleRequestSort("userId")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                      User ID
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === "registeredAt"}
                    direction={orderBy === "registeredAt" ? order : "asc"}
                    onClick={() => handleRequestSort("registeredAt")}
                  >
                    Registered At
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3, fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === "updatedAt"}
                    direction={orderBy === "updatedAt" ? order : "asc"}
                    onClick={() => handleRequestSort("updatedAt")}
                  >
                    Updated At
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : getFilteredCount() === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No face IDs found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                getPaginatedFaceIds().map((faceId, index) => (
                  <TableRow
                    key={faceId.userId}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "#f8f9fa" },
                      backgroundColor: index % 2 === 0 ? "transparent" : "#fafafa"
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 2, px: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {faceId.userId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Chip
                        label={faceId.status}
                        variant="filled"
                        size="small"
                        color={getStatusColor(faceId.status)}
                        sx={{
                          fontWeight: 500,
                          minWidth: 80,
                          borderRadius: "16px"
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2">{formatDate(faceId.registeredAt)}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2">{formatDate(faceId.updatedAt)}</Typography>
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
    </Box>
  );
};

export default CurrentFaceIdPage;
