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
  Smartphone as SmartphoneIcon,
  Computer as ComputerIcon,
  Android as AndroidIcon,
  Apple as AppleIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import DeviceServices from "services/devices.service";

const PAGE_SIZE = 5;

const RequestsDevicesPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  // states
  const [devices, setDevices] = useState([]);
  console.log(devices);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("userId");
  const [totalCount, setTotalCount] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const result = await DeviceServices.getDevices();

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        setDevices([]);
        setTotalCount(0);
      } else {
        // Transform the API data to match the expected format, filter for Pending devices only
        const transformedDevices = (result.data || [])
          .map((device) => ({
            userId: device.UserFullName || device.UserId,
            deviceName: device.DeviceName,
            platform: device.Platform,
            osVersion: device.OsVersion,
            model: device.Model,
            manufacturer: device.Manufacturer,
            appVersion: device.AppVersion,
            status: device.Status,
            deviceId: device.DeviceId,
            userEmail: device.UserEmail,
            macAddress: device.MacAddress,
            createdAt: device.CreatedAt,
            updatedAt: device.UpdatedAt,
            lastVerifiedAt: device.LastVerifiedAt
          }))
          .filter((device) => device.status === "Pending"); // Only show Pending devices

        setDevices(transformedDevices);
        setTotalCount(transformedDevices.length);
      }
    } catch (error) {
      console.error("Error in fetchDevices:", error);
      enqueueSnackbar("Failed to fetch device requests", { variant: "error" });
      setDevices([]);
      setTotalCount(0);
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
      day: "numeric"
    });
  };

  const handleApprove = (device) => {
    setSelectedDevice(device);
    setActionType("approve");
    setConfirmDialogOpen(true);
  };

  const handleReject = (device) => {
    setSelectedDevice(device);
    setActionType("reject");
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedDevice || !actionType) return;

    setSubmitting(true);
    try {
      let result;
      if (actionType === "approve") {
        result = await DeviceServices.approveDevice(selectedDevice.userId);
      } else {
        result = await DeviceServices.rejectDevice(selectedDevice.userId);
      }

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
      } else {
        enqueueSnackbar(
          `Device ${actionType === "approve" ? "approved" : "rejected"} successfully`,
          { variant: "success" }
        );
        // Remove from local state (simulate moving to current devices or removing)
        setDevices((prev) => prev.filter((d) => d.userId !== selectedDevice.userId));
        setTotalCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing device:`, error);
      enqueueSnackbar(`Failed to ${actionType} device`, { variant: "error" });
    } finally {
      setSubmitting(false);
      setConfirmDialogOpen(false);
      setSelectedDevice(null);
      setActionType(null);
    }
  };

  const handleCancelAction = () => {
    setConfirmDialogOpen(false);
    setSelectedDevice(null);
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
      // For user names, use string comparison
      return valueA.localeCompare(valueB);
    }

    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  };

  const getSortedAndFilteredDevices = () => {
    return devices.sort((a, b) => {
      const comparison = compareValues(a, b, orderBy);
      return order === "desc" ? -comparison : comparison;
    });
  };

  const getPaginatedDevices = () => {
    const sortedAndFilteredDevices = getSortedAndFilteredDevices();
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedAndFilteredDevices.slice(startIndex, endIndex);
  };

  const getFilteredCount = () => {
    return getSortedAndFilteredDevices().length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "android":
        return <AndroidIcon sx={{ mr: 1, fontSize: 20 }} />;
      case "ios":
        return <AppleIcon sx={{ mr: 1, fontSize: 20 }} />;
      default:
        return <SmartphoneIcon sx={{ mr: 1, fontSize: 20 }} />;
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
            Pending Device Requests
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and manage pending device registration requests
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
          <Table aria-label="device requests table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "userId"}
                    direction={orderBy === "userId" ? order : "asc"}
                    onClick={() => handleRequestSort("userId")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <SmartphoneIcon sx={{ mr: 1, fontSize: 20 }} />
                      User Name
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "deviceName"}
                    direction={orderBy === "deviceName" ? order : "asc"}
                    onClick={() => handleRequestSort("deviceName")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ComputerIcon sx={{ mr: 1, fontSize: 20 }} />
                      Device
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "platform"}
                    direction={orderBy === "platform" ? order : "asc"}
                    onClick={() => handleRequestSort("platform")}
                  >
                    Platform
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>OS Version</TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "model"}
                    direction={orderBy === "model" ? order : "asc"}
                    onClick={() => handleRequestSort("model")}
                  >
                    Model
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "manufacturer"}
                    direction={orderBy === "manufacturer" ? order : "asc"}
                    onClick={() => handleRequestSort("manufacturer")}
                  >
                    Manufacturer
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>App Version</TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
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
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : getFilteredCount() === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No pending device requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                getPaginatedDevices().map((device) => (
                  <TableRow
                    key={device.userId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 2, px: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {device.userId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {device.deviceName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {getPlatformIcon(device.platform)}
                        <Typography variant="body2">{device.platform}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2">{device.osVersion}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2">{device.model}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2">{device.manufacturer}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2">{device.appVersion}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Chip
                        label={device.status}
                        variant="outlined"
                        size="small"
                        color={getStatusColor(device.status)}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(device)}
                            size="small"
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="error"
                            onClick={() => handleReject(device)}
                            size="small"
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    {/* <TableCell
                      align="center"
                      sx={{ py: 2, px: 3, width: "200px", minWidth: "200px" }}
                    >
                      {device.status === "Pending" ? (

                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          <Tooltip title="Approve Device">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckIcon />}
                              onClick={() => handleApprove(device)}
                              sx={{
                                minWidth: "auto",
                                px: 2,
                                textTransform: "none"
                              }}
                            >
                              Approve
                            </Button>
                          </Tooltip>
                          <Tooltip title="Reject Device">
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<CloseIcon />}
                              onClick={() => handleReject(device)}
                              sx={{
                                minWidth: "auto",
                                px: 2,
                                textTransform: "none"
                              }}
                            >
                              Reject
                            </Button>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No actions available
                        </Typography>
                      )}
                    </TableCell> */}
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

      {/* Confirm Action Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelAction}
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
          <Typography
            variant="h6"
            component="div"
            color={actionType === "approve" ? "success.main" : "error.main"}
          >
            {actionType === "approve" ? "Approve Device" : "Reject Device"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to {actionType} the device request for user{" "}
            <strong>{selectedDevice?.userId}</strong> ({selectedDevice?.deviceName})?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {actionType === "approve"
              ? "This will allow the device to access the system."
              : "This will deny the device access to the system."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCancelAction}
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
            onClick={handleConfirmAction}
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
            disabled={submitting}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3
            }}
          >
            {submitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : actionType === "approve" ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestsDevicesPage;
