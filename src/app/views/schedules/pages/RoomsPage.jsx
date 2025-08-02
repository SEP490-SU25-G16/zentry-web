import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  TableSortLabel,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormHelperText
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Add as AddIcon
} from "@mui/icons-material";
import RoomServices from "services/rooms.service";
import { useAppLoadingContext } from "app/contexts/AppLoadingContext";
import { useSnackbar } from "notistack";

const PAGE_SIZE = 5;

const RoomsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  // states
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("RoomName");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [formData, setFormData] = useState({
    roomName: "",
    building: "",
    capacity: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading delay
    try {
      const { data, error } = await RoomServices.getRooms();

      if (error) {
        console.error("Failed to fetch rooms:", error);
      } else {
        setRooms(data?.Data?.Items || []);
        setTotalCount(data?.Data?.TotalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing page size
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleEdit = (room) => {
    setIsEditMode(true);
    setEditingRoomId(room.Id);
    setFormData({
      roomName: room.RoomName,
      building: room.Building,
      capacity: room.Capacity.toString()
    });
    setFormErrors({});
    setOpenModal(true);
  };

  const handleDelete = async (roomId) => {
    const room = rooms.find((r) => r.Id === roomId);
    if (room) {
      setRoomToDelete(room);
      setConfirmDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;

    try {
      setSubmitting(true);
      const { data, error } = await RoomServices.deleteRoom(roomToDelete.Id);

      if (error) {
        console.error("Error deleting room:", error);
        // TODO: Show error message to user
      } else {
        console.log("Room deleted successfully:", data);
        // Refresh the rooms list after successful deletion
        await fetchRooms();
        // TODO: Show success message
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      // TODO: Show error message
    } finally {
      setSubmitting(false);
      setConfirmDeleteOpen(false);
      setRoomToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setRoomToDelete(null);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0); // Reset to first page when sorting
  };

  const compareValues = (a, b, orderBy) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    // Handle different data types
    if (orderBy === "Capacity") {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    } else if (orderBy === "CreatedAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else {
      aValue = aValue?.toString().toLowerCase() || "";
      bValue = bValue?.toString().toLowerCase() || "";
    }

    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }
    return 0;
  };

  const getSortedAndFilteredRooms = () => {
    // Filter rooms by search term first
    let filteredRooms = rooms.filter(
      (room) =>
        room.RoomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.Building?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then sort the filtered data
    const sortedRooms = filteredRooms.sort((a, b) => {
      const comparison = compareValues(a, b, orderBy);
      return order === "asc" ? comparison : -comparison;
    });

    return sortedRooms;
  };

  const getPaginatedRooms = () => {
    const sortedAndFilteredRooms = getSortedAndFilteredRooms();
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedAndFilteredRooms.slice(startIndex, endIndex);
  };

  const getFilteredCount = () => {
    return getSortedAndFilteredRooms().length;
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingRoomId(null);
    setOpenModal(true);
    setFormData({
      roomName: "",
      building: "",
      capacity: ""
    });
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditMode(false);
    setEditingRoomId(null);
    setFormData({
      roomName: "",
      building: "",
      capacity: ""
    });
    setFormErrors({});
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Room Name validation
    if (!formData.roomName.trim()) {
      errors.roomName = "Room name is required";
    } else if (formData.roomName.trim().length < 2) {
      errors.roomName = "Room name must be at least 2 characters";
    } else if (formData.roomName.trim().length > 100) {
      errors.roomName = "Room name must be less than 100 characters";
    }

    // Building validation
    if (!formData.building.trim()) {
      errors.building = "Building is required";
    } else if (formData.building.trim().length < 1) {
      errors.building = "Building must be at least 1 character";
    } else if (formData.building.trim().length > 50) {
      errors.building = "Building must be less than 50 characters";
    }

    // Capacity validation
    if (!formData.capacity.toString().trim()) {
      errors.capacity = "Capacity is required";
    } else {
      const capacityNum = parseInt(formData.capacity);
      if (isNaN(capacityNum) || capacityNum < 1) {
        errors.capacity = "Capacity must be a positive number";
      } else if (capacityNum > 1000) {
        errors.capacity = "Capacity must be less than 1000";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setSubmitting(true);

    try {
      const roomData = {
        roomName: formData.roomName.trim(),
        building: formData.building.trim(),
        capacity: parseInt(formData.capacity)
      };

      let result;
      if (isEditMode) {
        // Edit existing room
        result = await RoomServices.editRoom(editingRoomId, roomData);
        console.log("Editing room:", roomData);
      } else {
        // Add new room
        result = await RoomServices.addRoom(roomData);
        console.log("Creating room:", roomData);
      }

      if (result.error) {
        console.error(`Error ${isEditMode ? "editing" : "creating"} room:`, result.error);
        enqueueSnackbar(`Error ${isEditMode ? "editing" : "creating"} room: ${result.error}`, {
          variant: "error"
        });
      } else {
        console.log(`Room ${isEditMode ? "edited" : "created"} successfully:`, result.data);
        enqueueSnackbar(`Room ${isEditMode ? "edited" : "created"} successfully`, {
          variant: "success"
        });

        // Close modal and refresh data
        handleCloseModal();
        await fetchRooms();
        // TODO: Show success message
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "editing" : "creating"} room:`, error);
      // TODO: Show error message
    } finally {
      setSubmitting(false);
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
      {/* Header */}
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
            Rooms Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and organize all rooms in your facility
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
          Add Room
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2, width: "100%", maxWidth: "1400px" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by room name or building..."
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
            }
          }}
        />
      </Box>

      {/* Table */}
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
          <Table aria-label="rooms ">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "RoomName"}
                    direction={orderBy === "RoomName" ? order : "asc"}
                    onClick={() => handleRequestSort("RoomName")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BusinessIcon sx={{ mr: 1, fontSize: 20 }} />
                      Room Name
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "Building"}
                    direction={orderBy === "Building" ? order : "asc"}
                    onClick={() => handleRequestSort("Building")}
                  >
                    Building
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "Capacity"}
                    direction={orderBy === "Capacity" ? order : "asc"}
                    onClick={() => handleRequestSort("Capacity")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PeopleIcon sx={{ mr: 1, fontSize: 20 }} />
                      Capacity
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "CreatedAt"}
                    direction={orderBy === "CreatedAt" ? order : "asc"}
                    onClick={() => handleRequestSort("CreatedAt")}
                  >
                    Created At
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
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : getFilteredCount() === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm ? `No rooms found matching "${searchTerm}"` : "No rooms found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                getPaginatedRooms().map((room) => (
                  <TableRow
                    key={room.Id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 2, px: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {room.RoomName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {room.Id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Chip
                        label={room.Building}
                        variant="outlined"
                        size="small"
                        color="primary"
                        icon={<BusinessIcon />}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2, px: 3 }}>
                      <Chip
                        label={`${room.Capacity} people`}
                        variant="filled"
                        size="small"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="body2">{formatDate(room.CreatedAt)}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2, px: 3 }}>
                      <Tooltip title="Edit Room">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(room)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Room">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(room.Id)}
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

      {/* Room Modal */}
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
            {isEditMode ? "Edit Room" : "Add New Room"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <FormControl fullWidth error={!!formErrors.roomName}>
              <TextField
                label="Room Name"
                value={formData.roomName}
                onChange={handleFormChange("roomName")}
                error={!!formErrors.roomName}
                placeholder="e.g., Room A1015"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  }
                }}
              />
              {formErrors.roomName && <FormHelperText>{formErrors.roomName}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.building}>
              <TextField
                label="Building"
                value={formData.building}
                onChange={handleFormChange("building")}
                error={!!formErrors.building}
                placeholder="e.g., Building B"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  }
                }}
              />
              {formErrors.building && <FormHelperText>{formErrors.building}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.capacity}>
              <TextField
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={handleFormChange("capacity")}
                error={!!formErrors.capacity}
                placeholder="e.g., 50"
                fullWidth
                inputProps={{ min: 1, max: 1000 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  }
                }}
              />
              {formErrors.capacity && <FormHelperText>{formErrors.capacity}</FormHelperText>}
            </FormControl>
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
            disabled={submitting}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3
            }}
          >
            {submitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditMode ? (
              "Update Room"
            ) : (
              "Add Room"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
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
            Delete Room
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the room <strong>{roomToDelete?.RoomName}</strong>?
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

export default RoomsPage;
