import React from "react";
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
  Tooltip
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Code as CodeIcon
} from "@mui/icons-material";
import { useCourses } from "../hooks";

const CoursesPage = () => {
  const {
    // State
    courses,
    loading,
    submitting,
    page,
    rowsPerPage,
    order,
    orderBy,
    searchTerm,
    openModal,
    isEditMode,
    formData,
    formErrors,
    confirmDeleteOpen,
    courseToDelete,

    // Computed values
    paginatedCourses,
    filteredCount,

    // Handlers
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleRequestSort,
    handleOpenModal,
    handleCloseModal,
    handleFormChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,

    // Utilities
    formatDate
  } = useCourses();

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
            Courses Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and organize all courses in your institution
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
          Add Course
        </Button>
      </Box>

      <Box sx={{ mb: 2, width: "100%", maxWidth: "1400px" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by course name, code, or description..."
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
          <Table aria-label="courses table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "Code"}
                    direction={orderBy === "Code" ? order : "asc"}
                    onClick={() => handleRequestSort("Code")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CodeIcon sx={{ mr: 1, fontSize: 20 }} />
                      Course Code
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>
                  <TableSortLabel
                    active={orderBy === "Name"}
                    direction={orderBy === "Name" ? order : "asc"}
                    onClick={() => handleRequestSort("Name")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <SchoolIcon sx={{ mr: 1, fontSize: 20 }} />
                      Course Name
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ py: 2, px: 3 }}>Description</TableCell>
                <TableCell align="center" sx={{ py: 2, px: 3 }}>
                  Actions
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
              ) : filteredCount === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm
                        ? `No courses found matching "${searchTerm}"`
                        : "No courses found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCourses.map((course) => (
                  <TableRow
                    key={course.Id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 2, px: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {course.Code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {course.Id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {course.Name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                        title={course.Description}
                      >
                        {course.Description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2, px: 3 }}>
                      <Tooltip title="Edit Course">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(course)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Course">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(course.Id)}
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
          count={filteredCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
        />
      </Paper>

      {/* Add/Edit Course Modal */}
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
            {isEditMode ? "Edit Course" : "Add New Course"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <FormControl fullWidth error={!!formErrors.code}>
              <TextField
                label="Course Code"
                value={formData.code}
                onChange={handleFormChange("code")}
                error={!!formErrors.code}
                placeholder="e.g., CS101"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  }
                }}
              />
              {formErrors.code && <FormHelperText>{formErrors.code}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.name}>
              <TextField
                label="Course Name"
                value={formData.name}
                onChange={handleFormChange("name")}
                error={!!formErrors.name}
                placeholder="e.g., Introduction to Computer Science"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  }
                }}
              />
              {formErrors.name && <FormHelperText>{formErrors.name}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.description}>
              <TextField
                label="Description"
                value={formData.description}
                onChange={handleFormChange("description")}
                error={!!formErrors.description}
                placeholder="e.g., A foundational course in computer science."
                fullWidth
                multiline
                rows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  }
                }}
              />
              {formErrors.description && <FormHelperText>{formErrors.description}</FormHelperText>}
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
              "Update Course"
            ) : (
              "Add Course"
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
            Delete Course
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the course <strong>{courseToDelete?.Name}</strong> (
            {courseToDelete?.Code})?
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

export default CoursesPage;
