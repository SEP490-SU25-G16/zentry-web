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
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { mockFaceIdRequests } from "../mock/mockFaceIdRequests";

const PAGE_SIZE = 5;

const RequestFaceIdPage = () => {
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [selectedFaceId, setSelectedFaceId] = useState(null);

  useEffect(() => {
    fetchFaceIds();
  }, []);

  const fetchFaceIds = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    try {
      // Simulate API call - replace with actual API call
      const response = mockFaceIdRequests;
      setFaceIds(response);
      setTotalCount(response.length);
    } catch (error) {
      console.error("Error fetching face IDs:", error);
      enqueueSnackbar("Failed to fetch face ID requests", { variant: "error" });
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleApprove = (faceId) => {
    setSelectedFaceId(faceId);
    setActionType("approve");
    setConfirmDialogOpen(true);
  };

  const handleReject = (faceId) => {
    setSelectedFaceId(faceId);
    setActionType("reject");
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedFaceId || !actionType) return;

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Update the face ID status locally
      setFaceIds((prevFaceIds) =>
        prevFaceIds.map((faceId) =>
          faceId.userId === selectedFaceId.userId
            ? { ...faceId, status: actionType === "approve" ? "Approved" : "Rejected" }
            : faceId
        )
      );

      enqueueSnackbar(
        `Face ID ${actionType === "approve" ? "approved" : "rejected"} successfully`,
        { variant: "success" }
      );
    } catch (error) {
      console.error(`Error ${actionType}ing face ID:`, error);
      enqueueSnackbar(`Failed to ${actionType} face ID`, { variant: "error" });
    } finally {
      setSubmitting(false);
      setConfirmDialogOpen(false);
      setSelectedFaceId(null);
      setActionType(null);
    }
  };

  const handleCancelAction = () => {
    setConfirmDialogOpen(false);
    setSelectedFaceId(null);
    setActionType(null);
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

    if (orderBy === "registeredAt") {
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
    return faceIds.sort((a, b) => compareValues(a, b, orderBy));
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
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Pending":
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
            Face ID Requests Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and approve Face ID registration requests
          </Typography>
        </Box>
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
          <Table aria-label="face id requests table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "userId"}
                    direction={orderBy === "userId" ? order : "asc"}
                    onClick={() => handleRequestSort("userId")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                      User ID
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
                    Encrypted Embedding
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "registeredAt"}
                    direction={orderBy === "registeredAt" ? order : "asc"}
                    onClick={() => handleRequestSort("registeredAt")}
                  >
                    Registered At
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : getFilteredCount() === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No face ID requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                getPaginatedFaceIds().map((faceId) => (
                  <TableRow
                    key={faceId.userId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 2, px: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {faceId.userId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Tooltip title={faceId.encrypted_embedding} arrow>
                        <Box
                          sx={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                            backgroundColor: "#f5f5f5",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          {faceId.encrypted_embedding}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2">{formatDate(faceId.registeredAt)}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Chip
                        label={faceId.status}
                        variant="outlined"
                        size="small"
                        color={getStatusColor(faceId.status)}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(faceId)}
                            disabled={faceId.status !== "Pending"}
                            size="small"
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="error"
                            onClick={() => handleReject(faceId)}
                            disabled={faceId.status !== "Pending"}
                            size="small"
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelAction}>
        <DialogTitle>{actionType === "approve" ? "Approve Face ID" : "Reject Face ID"}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType} the Face ID request for user{" "}
            <strong>{selectedFaceId?.userId}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
            disabled={submitting}
          >
            {submitting ? "Processing..." : actionType === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestFaceIdPage;
