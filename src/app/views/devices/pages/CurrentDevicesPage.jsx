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
import {
  Smartphone as SmartphoneIcon,
  Computer as ComputerIcon,
  Android as AndroidIcon,
  Apple as AppleIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import DeviceServices from "services/devices.service";

const PAGE_SIZE = 5;

const CurrentDevicesPage = () => {
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
  const [searchTerm, setSearchTerm] = useState("");

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
        // Transform the API data to match the expected format
        const transformedDevices = (result.data || []).map((device) => ({
          userId: device.UserFullName || device.UserId, // Use full name as display
          deviceName: device.DeviceName,
          platform: device.Platform,
          osVersion: device.OsVersion,
          model: device.Model,
          manufacturer: device.Manufacturer,
          appVersion: device.AppVersion,
          status: device.Status, // Map status ID to readable status
          deviceId: device.DeviceId,
          userEmail: device.UserEmail,
          macAddress: device.MacAddress,
          createdAt: device.CreatedAt,
          updatedAt: device.UpdatedAt,
          lastVerifiedAt: device.LastVerifiedAt
        }));

        setDevices(transformedDevices);
        setTotalCount(transformedDevices.length);
      }
    } catch (error) {
      console.error("Error in fetchDevices:", error);
      enqueueSnackbar("Failed to fetch devices", { variant: "error" });
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0); // Reset to first page when sorting
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
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
    // First filter by search term
    const filteredDevices = devices.filter((device) =>
      device.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then sort the filtered devices
    return filteredDevices.sort((a, b) => {
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
      case "Active":
        return "success";
      case "Inactive":
        return "error";
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
      case "ipados":
        return <AppleIcon sx={{ mr: 1, fontSize: 20 }} />;
      case "windows":
      case "macos":
      case "chrome os":
        return <ComputerIcon sx={{ mr: 1, fontSize: 20 }} />;
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
            Current Devices Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor all registered devices in your system
          </Typography>
        </Box>
        <Box sx={{ minWidth: 300 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by user name..."
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px"
              }
            }}
          />
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
          <Table aria-label="devices table">
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
                      Device Name
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
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : getFilteredCount() === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No devices found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                getPaginatedDevices().map((device, index) => (
                  <TableRow
                    key={device.deviceId || index}
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

export default CurrentDevicesPage;
