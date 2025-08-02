import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClassIcon from "@mui/icons-material/Class";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RoomIcon from "@mui/icons-material/Room";
import { useClasses } from "../hooks";
import { useUsers } from "../../users/hooks";
import RoomServices from "services/rooms.service";

const ClassDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClass, enrollStudent, bulkEnrollStudents } = useClasses();
  const { users, loading: usersLoading } = useUsers();

  const [classDetail, setClassDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  // Rooms state
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  console.log("rooms", rooms);

  // Add Schedule Modal state
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    roomId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    weekDay: ""
  });
  const [addingSchedule, setAddingSchedule] = useState(false);

  useEffect(() => {
    const fetchClassDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getClass(id);

        if (result.success) {
          setClassDetail(result?.data);
        } else {
          setError(result.error || "Failed to fetch class details");
        }
      } catch (err) {
        console.error("Error fetching class details:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetail();
  }, []);

  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      const result = await RoomServices.getRooms();
      console.log(result);
      if (result.error) {
        console.error("Error fetching rooms:", result.error);
        setRooms([]);
      } else {
        // Transform rooms data based on API response structure
        const roomsData = result.data?.Data?.Items || result.data?.Data || result.data || [];
        console.log(roomsData);
        const transformedRooms = roomsData.map((room) => ({
          id: room.Id || room.id,
          name: room.RoomName,
          building: room.Building || room.building,
          capacity: room.Capacity || room.capacity,
          // Keep original for reference
          original: room
        }));
        setRooms(transformedRooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
    } finally {
      setRoomsLoading(false);
    }
  };

  const handleEnrollStudent = () => {
    setEnrollModalOpen(true);
    setSelectedStudents([]);
    setStudentSearchTerm("");
  };

  const handleCloseEnrollModal = () => {
    setEnrollModalOpen(false);
    setSelectedStudents([]);
    setStudentSearchTerm("");
  };

  const handleAddSchedule = () => {
    setAddScheduleModalOpen(true);
    setScheduleForm({
      roomId: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      weekDay: ""
    });
    // Always fetch rooms when opening the modal to ensure fresh data
    fetchRooms();
  };

  const handleCloseAddScheduleModal = () => {
    setAddScheduleModalOpen(false);
    setScheduleForm({
      roomId: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      weekDay: ""
    });
  };

  const handleScheduleFormChange = (field, value) => {
    setScheduleForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmAddSchedule = async () => {
    if (
      !scheduleForm.roomId ||
      !scheduleForm.startDate ||
      !scheduleForm.endDate ||
      !scheduleForm.startTime ||
      !scheduleForm.endTime ||
      !scheduleForm.weekDay
    ) {
      return;
    }

    setAddingSchedule(true);
    try {
      // Create schedule data payload
      const scheduleData = {
        lecturerId: classDetail.lecturerId || classDetail.original?.LecturerId,
        classSectionId: id,
        roomId: scheduleForm.roomId,
        startDate: scheduleForm.startDate,
        endDate: scheduleForm.endDate,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        weekDay: scheduleForm.weekDay
      };

      console.log("Adding schedule with data:", scheduleData);

      // TODO: Implement addSchedule API call when service is available
      // const result = await addSchedule(scheduleData);

      // For now, just show success message
      // if (result.success) {
      handleCloseAddScheduleModal();

      // Refresh class details to update schedules
      const classResult = await getClass(id);
      if (classResult.success) {
        setClassDetail(classResult.data);
      }
      // }
    } catch (error) {
      console.error("Error adding schedule:", error);
    } finally {
      setAddingSchedule(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudents((prev) => {
      const isAlreadySelected = prev.some((s) => s.UserId === student.UserId);
      if (isAlreadySelected) {
        // Remove student if already selected
        return prev.filter((s) => s.UserId !== student.UserId);
      } else {
        // Add student if not selected
        return [...prev, student];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === availableStudents.length) {
      // Deselect all
      setSelectedStudents([]);
    } else {
      // Select all
      setSelectedStudents([...availableStudents]);
    }
  };

  const handleConfirmEnrollment = async () => {
    if (selectedStudents.length === 0) return;

    setEnrolling(true);
    try {
      let result;

      if (selectedStudents.length === 1) {
        // Use single enrollment for one student
        result = await enrollStudent(id, selectedStudents[0].UserId);
      } else {
        // Use bulk enrollment for multiple students
        const studentIds = selectedStudents.map((student) => student.UserId);
        result = await bulkEnrollStudents(id, studentIds);
      }

      if (result.success) {
        handleCloseEnrollModal();

        // Refresh class details to update enrollment count
        const classResult = await getClass(id);
        if (classResult.success) {
          setClassDetail(classResult.data);
        }
      }
      // Error handling is done in the hook with snackbar notifications
    } catch (error) {
      console.error("Unexpected error enrolling student(s):", error);
    } finally {
      setEnrolling(false);
    }
  };

  // Filter students based on search term and exclude already enrolled
  const availableStudents = users
    // .filter((user) => user.Role === "Student") // Only show students
    .filter(
      (user) =>
        user.FullName?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        (user.Email?.toLowerCase().includes(studentSearchTerm.toLowerCase()) &&
          user.Status === "Active") // Only show active students
    )
    // TODO: Filter out already enrolled students when enrollment API is available
    .slice(0, 20); // Limit to first 20 results for performance

  // Week days for schedule form
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh"
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading class details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ m: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate("/schedules/classes")}
          startIcon={<ArrowBackIcon />}
        >
          Back to Classes
        </Button>
      </Box>
    );
  }

  if (!classDetail) {
    return (
      <Box sx={{ m: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Class not found
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate("/schedules/classes")}
          startIcon={<ArrowBackIcon />}
        >
          Back to Classes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/schedules/classes")}
          startIcon={<ArrowBackIcon />}
          sx={{ minWidth: "auto" }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Class Details
        </Typography>
        <Button
          variant="contained"
          onClick={handleEnrollStudent}
          startIcon={<PersonAddIcon />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1
          }}
        >
          Enroll Students
        </Button>
        <Chip label={classDetail.semester} color="primary" variant="outlined" size="medium" />
      </Box>

      {/* General Information Card */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <ClassIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
            <Typography variant="h5" component="h2" fontWeight={600}>
              General Information
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Section Code */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BookIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Section Code
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {classDetail.sectionCode}
              </Typography>
            </Grid>

            {/* Course Information */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BookIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Course
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {classDetail.courseName || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Code: {classDetail.original?.CourseCode || "N/A"}
              </Typography>
            </Grid>

            {/* Lecturer Information */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Lecturer
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {classDetail.lecturerName ||
                  classDetail.original?.LecturerFullName ||
                  "Not Assigned"}
              </Typography>
              {classDetail.original?.LecturerEmail && (
                <Typography variant="body2" color="text.secondary">
                  {classDetail.original.LecturerEmail}
                </Typography>
              )}
            </Grid>

            {/* Semester */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarTodayIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Semester
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {classDetail.semester}
              </Typography>
            </Grid>

            {/* Number of Students */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Enrolled Students
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {classDetail.numberOfStudents} students
              </Typography>
            </Grid>

            {/* Class ID */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Class ID
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                {classDetail.id}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Timestamps */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Created At
              </Typography>
              <Typography variant="body2">{formatDate(classDetail.original?.CreatedAt)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="body2">{formatDate(classDetail.original?.UpdatedAt)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Placeholder for future sections */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)"
              }
            }}
            onClick={handleEnrollStudent}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <PersonAddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                Enrollments
              </Typography>
              <Typography variant="body2" color="text.disabled" gutterBottom>
                {classDetail.numberOfStudents || 0} enrolled students
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                Click to enroll students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: 200,
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)"
              }
            }}
            onClick={handleAddSchedule}
          >
            <CardContent
              sx={{
                textAlign: "center",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                Class Schedules
              </Typography>
              <Typography variant="body2" color="text.disabled" gutterBottom>
                {classDetail.original?.Schedules?.length || 0} time slots
              </Typography>
              {classDetail.original?.Schedules?.length > 0 ? (
                <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 500 }}>
                  {classDetail.original.Schedules[0].RoomName} •{" "}
                  {classDetail.original.Schedules[0].WeekDay}
                </Typography>
              ) : (
                <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 500 }}>
                  Click to add schedule
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Schedules Section */}
      {classDetail.original?.Schedules && classDetail.original.Schedules.length > 0 && (
        <Card sx={{ mt: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarTodayIcon sx={{ fontSize: 32, color: "secondary.main", mr: 2 }} />
                <Typography variant="h5" component="h2" fontWeight={600}>
                  Class Schedules
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleAddSchedule}
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1
                }}
              >
                Add Schedule
              </Button>
            </Box>

            <Grid container spacing={2}>
              {classDetail.original.Schedules.map((schedule, index) => (
                <Grid item xs={12} md={6} lg={4} key={schedule.Id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                      border: "1px solid",
                      borderColor: "divider",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)"
                      }
                    }}
                    onClick={() => navigate(`/schedules/class/${id}/session/${schedule.Id}`)}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Chip
                          label={`Session ${index + 1}`}
                          color="secondary"
                          size="small"
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                          {schedule.WeekDay}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Time
                        </Typography>
                        <Typography variant="h6" fontWeight={500}>
                          {schedule.StartTime.slice(0, 5)} - {schedule.EndTime.slice(0, 5)}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Room
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {schedule.RoomName}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Date
                        </Typography>
                        <Typography variant="body2">
                          {new Date(schedule.StartDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                          {schedule.StartDate !== schedule.EndDate && (
                            <>
                              {" - "}
                              {new Date(schedule.EndDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Student Enrollment Modal */}
      <Dialog
        open={enrollModalOpen}
        onClose={handleCloseEnrollModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px" }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PersonAddIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6">Enroll Students in {classDetail?.sectionCode}</Typography>
          </Box>
          <Button onClick={handleCloseEnrollModal} sx={{ minWidth: "auto", p: 1 }}>
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {/* Search Field */}
          <TextField
            fullWidth
            placeholder="Search students by name or email..."
            value={studentSearchTerm}
            onChange={(e) => setStudentSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          {/* Selection Summary */}
          {selectedStudents.length > 0 && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "primary.light", borderRadius: "8px" }}>
              <Typography variant="body2" color="primary.dark">
                {selectedStudents.length} student{selectedStudents.length > 1 ? "s" : ""} selected
              </Typography>
            </Box>
          )}

          {/* Select All Button */}
          {availableStudents.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      selectedStudents.length === availableStudents.length &&
                      availableStudents.length > 0
                    }
                    indeterminate={
                      selectedStudents.length > 0 &&
                      selectedStudents.length < availableStudents.length
                    }
                    onChange={handleSelectAll}
                  />
                }
                label={`Select All (${availableStudents.length} students)`}
              />
            </Box>
          )}

          {/* Loading State */}
          {usersLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading students...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Student List */}
              {availableStudents.length > 0 ? (
                <List sx={{ maxHeight: 400, overflow: "auto" }}>
                  {availableStudents.map((student) => {
                    const isSelected = selectedStudents.some((s) => s.UserId === student.UserId);
                    return (
                      <ListItem key={student.UserId} disablePadding>
                        <ListItemButton
                          onClick={() => handleSelectStudent(student)}
                          sx={{
                            borderRadius: "8px",
                            mb: 1,
                            backgroundColor: isSelected ? "primary.light" : "transparent",
                            "&:hover": {
                              backgroundColor: isSelected ? "primary.main" : "grey.100"
                            }
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            tabIndex={-1}
                            disableRipple
                            sx={{ mr: 1 }}
                          />
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              {student.FullName?.charAt(0) || "S"}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={student.FullName || "Unknown Name"}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {student.Email}
                                </Typography>
                                <Chip
                                  label={student.Status || "Active"}
                                  size="small"
                                  color={student.Status === "Active" ? "success" : "default"}
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {studentSearchTerm
                      ? `No students found matching "${studentSearchTerm}"`
                      : "No students available for enrollment"}
                  </Typography>
                </Box>
              )}

              {/* Selected Students Info */}
              {selectedStudents.length > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: "8px" }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Students ({selectedStudents.length}):
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {selectedStudents.map((student) => (
                      <Chip
                        key={student.UserId}
                        label={student.FullName || "Unknown"}
                        onDelete={() => handleSelectStudent(student)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseEnrollModal} variant="outlined" disabled={enrolling}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEnrollment}
            variant="contained"
            disabled={selectedStudents.length === 0 || enrolling}
            startIcon={enrolling ? <CircularProgress size={16} /> : <PersonAddIcon />}
          >
            {enrolling
              ? "Enrolling..."
              : `Enroll ${selectedStudents.length} Student${
                  selectedStudents.length > 1 ? "s" : ""
                }`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Schedule Modal */}
      <Dialog
        open={addScheduleModalOpen}
        onClose={handleCloseAddScheduleModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px" }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AddIcon sx={{ color: "secondary.main" }} />
            <Typography variant="h6">Add Schedule for {classDetail?.sectionCode}</Typography>
          </Box>
          <Button onClick={handleCloseAddScheduleModal} sx={{ minWidth: "auto", p: 1 }}>
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Room Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Room</InputLabel>
                <Select
                  value={scheduleForm.roomId}
                  label="Room"
                  onChange={(e) => handleScheduleFormChange("roomId", e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <RoomIcon />
                    </InputAdornment>
                  }
                >
                  {roomsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading rooms...
                    </MenuItem>
                  ) : rooms?.length > 0 ? (
                    rooms.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start"
                          }}
                        >
                          <Typography variant="body1">{room.name || room.roomName}</Typography>
                          {(room.building || room.capacity) && (
                            <Typography variant="caption" color="text.secondary">
                              {room.name && `Room: ${room.name}`}
                              {room.building && room.capacity && " • "}
                              {room.building && `Building: ${room.building}`}
                              {room.building && room.capacity && " • "}
                              {room.capacity && `Capacity: ${room.capacity}`}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No rooms available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Week Day Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Week Day</InputLabel>
                <Select
                  value={scheduleForm.weekDay}
                  label="Week Day"
                  onChange={(e) => handleScheduleFormChange("weekDay", e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  }
                >
                  {weekDays.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={scheduleForm.startDate}
                onChange={(e) => handleScheduleFormChange("startDate", e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                helperText="Course start date in semester"
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={scheduleForm.endDate}
                onChange={(e) => handleScheduleFormChange("endDate", e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                helperText="Course end date in semester"
              />
            </Grid>

            {/* Start Time */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={scheduleForm.startTime}
                onChange={(e) => handleScheduleFormChange("startTime", e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon />
                    </InputAdornment>
                  )
                }}
                helperText="Lesson start time"
              />
            </Grid>

            {/* End Time */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={scheduleForm.endTime}
                onChange={(e) => handleScheduleFormChange("endTime", e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon />
                    </InputAdornment>
                  )
                }}
                helperText="Lesson end time"
              />
            </Grid>
          </Grid>

          {/* Schedule Summary */}
          {(scheduleForm.weekDay ||
            scheduleForm.startTime ||
            scheduleForm.endTime ||
            scheduleForm.roomId) && (
            <Box sx={{ mt: 3, p: 2, bgcolor: "secondary.light", borderRadius: "8px" }}>
              <Typography variant="subtitle2" gutterBottom color="secondary.dark">
                Schedule Summary:
              </Typography>
              <Typography variant="body2" color="secondary.dark">
                {scheduleForm.weekDay && `${scheduleForm.weekDay} `}
                {scheduleForm.startTime &&
                  scheduleForm.endTime &&
                  `${scheduleForm.startTime} - ${scheduleForm.endTime} `}
                {scheduleForm.roomId && rooms && (
                  <>
                    in{" "}
                    {rooms.find((r) => r.id === scheduleForm.roomId)?.name ||
                      rooms.find((r) => r.id === scheduleForm.roomId)?.roomName ||
                      "Selected Room"}
                  </>
                )}
              </Typography>
              {scheduleForm.startDate && scheduleForm.endDate && (
                <Typography variant="caption" color="secondary.dark">
                  From {new Date(scheduleForm.startDate).toLocaleDateString()} to{" "}
                  {new Date(scheduleForm.endDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseAddScheduleModal}
            variant="outlined"
            disabled={addingSchedule}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAddSchedule}
            variant="contained"
            disabled={
              !scheduleForm.roomId ||
              !scheduleForm.startDate ||
              !scheduleForm.endDate ||
              !scheduleForm.startTime ||
              !scheduleForm.endTime ||
              !scheduleForm.weekDay ||
              addingSchedule
            }
            startIcon={addingSchedule ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {addingSchedule ? "Adding..." : "Add Schedule"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassDetailPage;
