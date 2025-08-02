import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Divider,
  CircularProgress,
  Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import ClassTable from "../components/ClassTable";
import ClassEditDialog from "../components/ClassEditDialog";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

import { mockClasses } from "../mock/mockClasses";
import { useCourses, useClasses } from "../hooks";
import { useUsers } from "../../users/hooks";

const ClassesPage = () => {
  // Use hooks to get real data
  const { courses, loading: coursesLoading } = useCourses();
  const { users, loading: usersLoading } = useUsers();
  const {
    classes,
    loading: classesLoading,
    submitting,
    createClass,
    updateClass,
    deleteClass,
    refreshClasses
  } = useClasses();

  const [selectedClass, setSelectedClass] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  // Check if data is still loading
  const isLoading = coursesLoading || usersLoading || classesLoading;

  // Filter users to get only lecturers
  const lecturers = useMemo(() => {
    return users.filter((user) => user.Role === "Lecturer");
  }, [users]);

  console.log(lecturers);

  // Helper function to get course name by courseId
  const getCourseNameById = (courseId) => {
    const course = courses.find((c) => c.Id === courseId);
    return course ? `${course.Code} - ${course.Name}` : "Unknown Course";
  };

  // Helper function to get lecturer name by lecturerId
  const getLecturerNameById = (lecturerId) => {
    const lecturer = lecturers.find((u) => u.UserId === lecturerId);
    return lecturer ? lecturer.FullName : "Unknown Lecturer";
  };

  // Transform classes data to include course and lecturer names
  const transformedClasses = classes.map((cls) => ({
    ...cls,
    // Use API-provided names if available, otherwise lookup from courses/lecturers
    courseName: cls.courseName || getCourseNameById(cls.courseId),
    lecturerName: cls.lecturerName || getLecturerNameById(cls.lecturerId)
  }));

  // Get all unique semesters
  const allSemesters = useMemo(() => {
    return [...new Set(transformedClasses.map((cls) => cls.semester))].sort();
  }, [transformedClasses]);

  // Get semester counts
  const semesterCounts = useMemo(() => {
    const counts = { all: transformedClasses.length };
    transformedClasses.forEach((cls) => {
      counts[cls.semester] = (counts[cls.semester] || 0) + 1;
    });
    return counts;
  }, [transformedClasses]);

  // Filter classes based on search term and selected semester
  const filteredClasses = useMemo(() => {
    let filtered = transformedClasses;

    // Filter by search term (course name)
    if (searchTerm.trim()) {
      filtered = filtered.filter((cls) =>
        cls.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected semester
    if (selectedSemester !== "all") {
      filtered = filtered.filter((cls) => cls.semester === selectedSemester);
    }

    return filtered;
  }, [transformedClasses, searchTerm, selectedSemester]);

  // Handle semester selection
  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
  };

  // Clear search filter
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // ---------- CLASS ----------
  const handleAddClass = () => {
    if (courses.length === 0 || lecturers.length === 0) {
      return; // Don't allow adding classes if data isn't loaded
    }
    setSelectedClass({
      id: "",
      courseId: "",
      lecturerId: "",
      courseName: "",
      lecturerName: "",
      sectionCode: "",
      semester: ""
    });
  };

  const handleEditClass = (cls) =>
    setSelectedClass({
      ...cls,
      courseName: getCourseNameById(cls.courseId),
      lecturerName: getLecturerNameById(cls.lecturerId)
    });

  const handleDeleteClass = (cls) => setDeleteTarget(cls);

  const handleClassSave = async (updated) => {
    // Find courseId and lecturerId from the names
    const course = courses.find((c) => `${c.Code} - ${c.Name}` === updated.courseName);
    const lecturer = lecturers.find((u) => u.FullName === updated.lecturerName);

    if (selectedClass?.id) {
      // Edit existing class - only sectionCode and semester can be updated
      const updateData = {
        sectionCode: updated.sectionCode,
        semester: updated.semester
      };

      const result = await updateClass(selectedClass.id, updateData);

      if (!result.success) {
        // Error handling is done in the hook with snackbar
        return;
      }
    } else {
      // Create new class - use the hook's createClass method
      const classData = {
        courseId: course?.Id || "",
        lecturerId: lecturer?.UserId || "",
        sectionCode: updated.sectionCode,
        semester: updated.semester
      };

      const result = await createClass(classData);

      if (!result.success) {
        // Error handling is done in the hook with snackbar
        return;
      }
    }

    setSelectedClass(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget?.id) {
      const result = await deleteClass(deleteTarget.id);

      if (result.success) {
        // Success handling is done in the hook with snackbar
        setDeleteTarget(null);
      }
      // If there's an error, the hook will show the error message
      // but we keep the dialog open so user can try again
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f5f5"
      }}
    >
      {/* Left Sidebar - Semester List */}
      <Box
        sx={{
          width: 280,
          backgroundColor: "white",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          pt: 10
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Semesters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a semester to view classes
          </Typography>
        </Box>

        <List sx={{ flex: 1, px: 1 }}>
          {/* All Semesters Option */}
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedSemester === "all"}
              onClick={() => handleSemesterSelect("all")}
              sx={{
                borderRadius: "8px",
                mx: 1,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark"
                  }
                }
              }}
            >
              <ListItemText
                primary="All Semesters"
                secondary={`${semesterCounts.all} classes`}
                secondaryTypographyProps={{
                  color: selectedSemester === "all" ? "inherit" : "text.secondary"
                }}
              />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ mx: 2, my: 1 }} />

          {/* Individual Semesters */}
          {allSemesters.map((semester) => (
            <ListItem key={semester} disablePadding>
              <ListItemButton
                selected={selectedSemester === semester}
                onClick={() => handleSemesterSelect(semester)}
                sx={{
                  borderRadius: "8px",
                  mx: 1,
                  mb: 1,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark"
                    }
                  }
                }}
              >
                <ListItemText
                  primary={semester}
                  secondary={`${semesterCounts[semester] || 0} classes`}
                  secondaryTypographyProps={{
                    color: selectedSemester === semester ? "inherit" : "text.secondary"
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Right Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            pt: 13,
            backgroundColor: "white",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start"
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Classes Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedSemester === "all"
                ? `Manage and organize all classes in your institution`
                : `Classes for ${selectedSemester} semester`}
              {!isLoading && (
                <span style={{ marginLeft: "8px", fontSize: "0.875rem" }}>
                  • {courses.length} courses • {lecturers.length} lecturers available
                </span>
              )}
            </Typography>
          </Box>
          <Tooltip
            title={
              isLoading
                ? "Loading courses and users data..."
                : submitting
                ? "Creating class..."
                : courses.length === 0
                ? "No courses available"
                : lecturers.length === 0
                ? "No lecturers available"
                : "Add a new class"
            }
          >
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClass}
                disabled={isLoading || submitting || courses.length === 0 || lecturers.length === 0}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  mt: 1
                }}
              >
                {submitting ? "Creating..." : "Add Class"}
              </Button>
            </span>
          </Tooltip>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ p: 3, backgroundColor: "white", borderBottom: "1px solid #e0e0e0" }}>
          <Stack spacing={2}>
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search by course name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8f9fa"
                }
              }}
            />

            {/* Results Summary */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {isLoading
                  ? "Loading data..."
                  : filteredClasses.length > 0
                  ? `Found ${filteredClasses.length} of ${transformedClasses.length} classes`
                  : "No classes found"}
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedSemester !== "all" && ` in ${selectedSemester}`}
              </Typography>
              {searchTerm && (
                <Chip
                  label="Clear Search"
                  clickable
                  onClick={handleClearSearch}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ borderRadius: "16px" }}
                />
              )}
            </Box>
          </Stack>
        </Box>

        {/* Classes Table */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3, backgroundColor: "#f8f9fa" }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px"
              }}
            >
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Loading courses and users data...
              </Typography>
            </Box>
          ) : (
            <ClassTable
              data={filteredClasses}
              onEdit={handleEditClass}
              onDelete={handleDeleteClass}
            />
          )}
        </Box>
      </Box>

      {/* Dialogs */}
      <ClassEditDialog
        open={Boolean(selectedClass)}
        initialData={selectedClass}
        onClose={() => setSelectedClass(null)}
        onSave={handleClassSave}
        courses={courses}
        lecturers={lecturers}
        isEditMode={Boolean(selectedClass?.id)}
        submitting={submitting}
      />
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Confirm Delete"
        content={`Are you sure you want to delete the class "${deleteTarget?.sectionCode}" for ${deleteTarget?.semester}?`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={submitting}
      />
    </Box>
  );
};

export default ClassesPage;
