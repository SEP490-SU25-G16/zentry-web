import { Visibility as VisibilityIcon } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookIcon from "@mui/icons-material/Book";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ClassIcon from "@mui/icons-material/Class";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RoomIcon from "@mui/icons-material/Room";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { instance } from "lib/axios";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomServices from "services/rooms.service";
import { useUsers } from "../../users/hooks";
import { useClasses } from "../hooks";

const ClassDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getClass,
    enrollStudent,
    bulkEnrollStudents,
    createSchedule,
    enrollLecturer,
    updateSchedule,
    deleteSchedule,
    updateSession,
    deleteSession
  } = useClasses();
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

  // Table pagination state
  const [enrollmentPage, setEnrollmentPage] = useState(0);
  const [enrollmentRowsPerPage, setEnrollmentRowsPerPage] = useState(5);
  const [schedulePage, setSchedulePage] = useState(0);
  const [scheduleRowsPerPage, setScheduleRowsPerPage] = useState(5);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsPage, setSessionsPage] = useState(0);
  const [sessionsRowsPerPage, setSessionsRowsPerPage] = useState(5);
  const [editSessionOpen, setEditSessionOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    lecturerId: "",
    startTime: "",
    endTime: "",
    sessionConfigs: { absentReportGracePeriodHours: "", totalAttendanceRounds: "" }
  });
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [deletingSession, setDeletingSession] = useState(null);
  const [deletingEnrollment, setDeletingEnrollment] = useState(null);
  const [removingEnrollment, setRemovingEnrollment] = useState(false);

  // Add Schedule Modal state
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    roomId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    weekDay: ""
  });
  const [addingSchedule, setAddingSchedule] = useState(false);

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  // Assign lecturer state
  const [assignLecturerOpen, setAssignLecturerOpen] = useState(false);
  const [selectedLecturerId, setSelectedLecturerId] = useState("");
  const [assigningLecturer, setAssigningLecturer] = useState(false);

  // Import students state
  const [importStudentsOpen, setImportStudentsOpen] = useState(false);
  const [importStudentsFile, setImportStudentsFile] = useState(null);
  const [importingStudents, setImportingStudents] = useState(false);

  // Import schedules state
  const [importSchedulesOpen, setImportSchedulesOpen] = useState(false);
  const [importSchedulesFile, setImportSchedulesFile] = useState(null);
  const [importingSchedules, setImportingSchedules] = useState(false);

  const lecturers = users.filter((user) => user.Role === "Lecturer");

  const fetchSessions = useCallback(async () => {
    if (!id) return;
    setSessionsLoading(true);
    try {
      const result = await instance.get(`class-sections/${id}/sessions`);
      const sessionsData = result.data?.Data?.Sessions || result.data?.Data || result.data || [];
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchClassDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getClass(id);
        console.log(result);

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

    (async () => {
      await fetchSessions();
    })();

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

  const handleOpenImportStudents = () => {
    setImportStudentsOpen(true);
    setImportStudentsFile(null);
  };

  const handleCloseImportStudents = () => {
    setImportStudentsOpen(false);
    setImportStudentsFile(null);
  };

  const confirmDeleteEnrollment = (enrollment) => {
    setDeletingEnrollment(enrollment);
  };

  const handleDeleteEnrollment = async () => {
    if (!deletingEnrollment) return;
    setRemovingEnrollment(true);
    try {
      const payload = {
        classSectionId: id,
        studentId: deletingEnrollment.StudentId || deletingEnrollment.studentId,
        enrollmentId: deletingEnrollment.EnrollmentId || deletingEnrollment.enrollmentId
      };
      const res = await instance.post("/enrollments/remove-student", payload);
      enqueueSnackbar(res.data?.Message || "Student removed successfully", { variant: "success" });
      const classResult = await getClass(id);
      if (classResult.success) {
        setClassDetail(classResult.data);
      }
      setDeletingEnrollment(null);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.Error?.Message || "Failed to remove student", {
        variant: "error"
      });
    } finally {
      setRemovingEnrollment(false);
    }
  };

  const handleImportStudentsSubmit = async () => {
    if (!importStudentsFile) return;
    const isCsv =
      importStudentsFile.type === "text/csv" ||
      importStudentsFile.name.toLowerCase().endsWith(".csv");
    if (!isCsv) return;
    setImportingStudents(true);
    try {
      const formData = new FormData();
      formData.append("file", importStudentsFile);
      formData.append("classSectionId", id);
      const res = await instance.post("/enrollments/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      enqueueSnackbar(res.data?.Message, { variant: "success" });
      if (res?.data) {
        handleCloseImportStudents();
        const classResult = await getClass(id);
        if (classResult.success) {
          setClassDetail(classResult.data);
        }
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.Error?.Message, { variant: "error" });
    } finally {
      setImportingStudents(false);
    }
  };

  const handleCloseEnrollModal = () => {
    setEnrollModalOpen(false);
    setSelectedStudents([]);
    setStudentSearchTerm("");
  };

  const handleAddSchedule = () => {
    setAddScheduleModalOpen(true);
    setEditingScheduleId(null);
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

  const handleEditSchedule = (schedule) => {
    setEditingScheduleId(schedule.Id || schedule.id);
    setAddScheduleModalOpen(true);
    // Prefill form
    const startDate = String(schedule.StartDate || schedule.startDate).slice(0, 10);
    const endDate = String(schedule.EndDate || schedule.endDate).slice(0, 10);
    const startTime = String(schedule.StartTime || schedule.startTime).slice(0, 5);
    const endTime = String(schedule.EndTime || schedule.endTime).slice(0, 5);
    setScheduleForm({
      roomId: schedule.RoomId || schedule.roomId || "",
      startDate: startDate || "",
      endDate: endDate || "",
      startTime: startTime || "",
      endTime: endTime || "",
      weekDay: schedule.WeekDay || schedule.weekDay || ""
    });
    fetchRooms();
  };

  const handleOpenImportSchedules = () => {
    setImportSchedulesOpen(true);
    setImportSchedulesFile(null);
  };

  const handleCloseImportSchedules = () => {
    setImportSchedulesOpen(false);
    setImportSchedulesFile(null);
  };

  const handleImportSchedulesSubmit = async () => {
    if (!importSchedulesFile) return;
    const isCsv =
      importSchedulesFile.type === "text/csv" ||
      importSchedulesFile.name.toLowerCase().endsWith(".csv");
    if (!isCsv) return;
    setImportingSchedules(true);
    try {
      const formData = new FormData();
      formData.append("file", importSchedulesFile);
      formData.append("classSectionId", id);
      const res = await instance.post("/schedules/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      enqueueSnackbar(res.data?.Message || "Imported schedules successfully", { variant: "success" });
      handleCloseImportSchedules();
      const classResult = await getClass(id);
      if (classResult.success) {
        setClassDetail(classResult.data);
      }
      await fetchSessions();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.Error?.Message || "Failed to import schedules", {
        variant: "error"
      });
    } finally {
      setImportingSchedules(false);
    }
  };

  const handleDeleteScheduleClick = (schedule) => {
    setScheduleToDelete(schedule);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    try {
      const result = await deleteSchedule(scheduleToDelete.Id || scheduleToDelete.id);
      if (result.success) {
        setDeleteConfirmOpen(false);
        setScheduleToDelete(null);
        await fetchSessions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----------- Session Edit/Delete -----------
  const openEditSession = (session) => {
    setEditingSessionId(session.Id);
    setSessionForm({
      lecturerId: classDetail?.lecturerId || classDetail?.original?.LecturerId || "",
      startTime: String(session.StartTime).replace(" ", "T"),
      endTime: String(session.EndTime).replace(" ", "T"),
      sessionConfigs: {
        absentReportGracePeriodHours: String(session.AbsentReportGracePeriodHours || ""),
        totalAttendanceRounds: String(session.TotalAttendanceRounds || "")
      }
    });
    setEditSessionOpen(true);
  };

  const handleSessionFormChange = (path, value) => {
    setSessionForm((prev) => {
      if (path.startsWith("sessionConfigs.")) {
        const key = path.split(".")[1];
        return { ...prev, sessionConfigs: { ...prev.sessionConfigs, [key]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  const handleSaveSession = async () => {
    if (!editingSessionId) return;
    const payload = {
      lecturerId: sessionForm.lecturerId,
      startTime: sessionForm.startTime,
      endTime: sessionForm.endTime,
      sessionConfigs: {
        absentReportGracePeriodHours: sessionForm.sessionConfigs.absentReportGracePeriodHours,
        totalAttendanceRounds: sessionForm.sessionConfigs.totalAttendanceRounds
      }
    };
    const res = await updateSession(editingSessionId, payload);
    if (res.success) {
      setEditSessionOpen(false);
      await fetchSessions();
    }
  };

  const confirmDeleteSession = (session) => {
    setDeletingSession(session);
  };

  const handleDeleteSession = async () => {
    if (!deletingSession) return;
    const res = await deleteSession(deletingSession.Id);
    if (res.success) {
      setDeletingSession(null);
      await fetchSessions();
    }
  };

  const handleOpenAssignLecturer = () => {
    setSelectedLecturerId(classDetail?.lecturerId || classDetail?.original?.LecturerId || "");
    setAssignLecturerOpen(true);
  };

  const handleCloseAssignLecturer = () => {
    setAssignLecturerOpen(false);
    setSelectedLecturerId("");
  };

  const handleConfirmAssignLecturer = async () => {
    if (!selectedLecturerId) return;
    setAssigningLecturer(true);
    try {
      const result = await enrollLecturer(id, selectedLecturerId);
      if (result.success) {
        handleCloseAssignLecturer();
        const classResult = await getClass(id);
        if (classResult.success) {
          setClassDetail(classResult.data);
        }
      }
    } catch (error) {
      console.error("Error assigning lecturer:", error);
    } finally {
      setAssigningLecturer(false);
    }
  };

  const handleCloseAddScheduleModal = () => {
    setAddScheduleModalOpen(false);
    setEditingScheduleId(null);
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
      // Schedule payload
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

      let result;
      if (editingScheduleId) {
        result = await updateSchedule(editingScheduleId, {
          roomId: scheduleData.roomId,
          startDate: scheduleData.startDate,
          endDate: scheduleData.endDate,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          weekDay: scheduleData.weekDay
        });
      } else {
        result = await createSchedule(scheduleData);
      }

      if (result.success) {
        handleCloseAddScheduleModal();

        // Refresh class details to update schedules
        const classResult = await getClass(id);
        if (classResult.success) {
          setClassDetail(classResult.data);
        }
        fetchSessions();
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
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
    .filter((user) => user.Role === "Student" && user.Status === "Active") // Only show students
    .filter(
      (user) =>
        user.FullName?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        (user.Email?.toLowerCase().includes(studentSearchTerm.toLowerCase()) &&
          user.Status === "Active") // Only show active students
    )
    .filter((user) => {
      // Filter out already enrolled students
      const enrolledStudentIds =
        classDetail?.original?.Enrollments?.map((enrollment) => enrollment.StudentId) || [];
      return !enrolledStudentIds.includes(user.UserId);
    })
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
        {/* <Button
          variant="contained"
          onClick={handleOpenImportStudents}
          startIcon={<PersonAddIcon />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1
          }}
        >
          Import Students
        </Button> */}
        <Button
          variant="outlined"
          onClick={handleOpenAssignLecturer}
          startIcon={<PersonIcon />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1
          }}
          disabled={usersLoading || lecturers.length === 0}
        >
          Assign Lecturer
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
                {classDetail.original?.Enrollments?.length || classDetail.numberOfStudents || 0}{" "}
                students
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
                {classDetail.original?.Enrollments?.length || classDetail.numberOfStudents || 0}{" "}
                enrolled students
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

      {/* Enrollments Table */}
      {classDetail.original?.Enrollments && classDetail.original.Enrollments.length > 0 && (
        <Card sx={{ mt: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PersonIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
                <Typography variant="h5" component="h2" fontWeight={600}>
                  Enrolled Students ({classDetail.original.Enrollments.length})
                </Typography>
              </Box>
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
                Enroll More Students
              </Button>
              <Button
                variant="outlined"
                onClick={handleOpenImportStudents}
                startIcon={<UploadFileIcon />}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1
                }}
              >
                Import Students
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Student ID</TableCell>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Student Name</TableCell>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Enrollment Date</TableCell>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classDetail.original.Enrollments.slice(
                    enrollmentPage * enrollmentRowsPerPage,
                    enrollmentPage * enrollmentRowsPerPage + enrollmentRowsPerPage
                  ).map((enrollment) => (
                    <TableRow key={enrollment.EnrollmentId}>
                      <TableCell sx={{ padding: "1em" }}>{enrollment.StudentId}</TableCell>
                      <TableCell sx={{ padding: "1em" }}>{enrollment.StudentName}</TableCell>
                      <TableCell sx={{ padding: "1em" }}>
                        {new Date(enrollment.EnrollmentDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </TableCell>
                      <TableCell sx={{ padding: "1em" }}>
                        <Chip
                          label={enrollment.Status}
                          color={enrollment.Status === "Active" ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ padding: "1em" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => confirmDeleteEnrollment(enrollment)}
                          sx={{ mr: 1, textTransform: "none", borderRadius: "6px" }}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={classDetail.original.Enrollments.length}
              page={enrollmentPage}
              onPageChange={(event, newPage) => setEnrollmentPage(newPage)}
              rowsPerPage={enrollmentRowsPerPage}
              onRowsPerPageChange={(event) => {
                setEnrollmentRowsPerPage(parseInt(event.target.value, 10));
                setEnrollmentPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      )}

      {/* Schedules Table */}
      {classDetail.original?.Schedules && classDetail.original.Schedules.length > 0 && (
        <Card sx={{ mt: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarTodayIcon sx={{ fontSize: 32, color: "secondary.main", mr: 2 }} />
                <Typography variant="h5" component="h2" fontWeight={600}>
                  Class Schedules ({classDetail.original.Schedules.length})
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  onClick={handleOpenImportSchedules}
                  startIcon={<UploadFileIcon />}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    mr: 1
                  }}
                >
                  Import Schedules
                </Button>
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
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Week Day</TableCell>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Time</TableCell>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Room</TableCell>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Date Range</TableCell>
                    <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classDetail.original.Schedules.slice(
                    schedulePage * scheduleRowsPerPage,
                    schedulePage * scheduleRowsPerPage + scheduleRowsPerPage
                  ).map((schedule) => (
                    <TableRow key={schedule.Id}>
                      <TableCell sx={{ padding: "1em" }}>
                        <Chip
                          label={schedule.WeekDay}
                          color="secondary"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: "1em" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                          {schedule.StartTime.slice(0, 5)} - {schedule.EndTime.slice(0, 5)}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "1em" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <RoomIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                          {schedule.RoomName}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: "1em" }}>
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
                      </TableCell>
                      <TableCell sx={{ padding: "1em" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditSchedule(schedule)}
                          sx={{ mr: 1, textTransform: "none", borderRadius: "6px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteScheduleClick(schedule)}
                          sx={{ textTransform: "none", borderRadius: "6px" }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={classDetail.original.Schedules.length}
              page={schedulePage}
              onPageChange={(event, newPage) => setSchedulePage(newPage)}
              rowsPerPage={scheduleRowsPerPage}
              onRowsPerPageChange={(event) => {
                setScheduleRowsPerPage(parseInt(event.target.value, 10));
                setSchedulePage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      )}

      {/* Sessions Table - right below Class Schedules */}
      <Card sx={{ mt: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarTodayIcon sx={{ fontSize: 32, color: "secondary.main", mr: 2 }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                Sessions ({sessions?.length || 0})
              </Typography>
            </Box>
          </Box>

          {sessionsLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading sessions...
              </Typography>
            </Box>
          ) : sessions.length > 0 ? (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Week Day</TableCell>
                      <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Time</TableCell>
                      <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ padding: "1em", fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions
                      .slice(
                        sessionsPage * sessionsRowsPerPage,
                        sessionsPage * sessionsRowsPerPage + sessionsRowsPerPage
                      )
                      .map((session) => {
                        const start = new Date(String(session.StartTime).replace(" ", "T"));
                        const end = new Date(String(session.EndTime).replace(" ", "T"));
                        const statusColor =
                          session.Status === "Completed"
                            ? "warning"
                            : session.Status === "Active"
                            ? "success"
                            : "primary";
                        return (
                          <TableRow key={session.Id}>
                            <TableCell sx={{ padding: "1em" }}>
                              <Chip label={session.WeekDay} color="secondary" size="small" />
                            </TableCell>
                            <TableCell sx={{ padding: "1em" }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <AccessTimeIcon
                                  sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                                />
                                {start.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                                {" - "}
                                {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ padding: "1em" }}>
                              {start.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </TableCell>
                            <TableCell sx={{ padding: "1em" }}>
                              <Chip label={session.Status} color={statusColor} size="small" />
                            </TableCell>
                            <TableCell sx={{ padding: "1em" }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    navigate(`/schedules/class/${id}/session/${session.Id}`)
                                  }
                                  sx={{ color: "primary.main" }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditSession(session)}
                                  sx={{ color: "primary.main" }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => confirmDeleteSession(session)}
                                  sx={{ color: "error.main" }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={sessions.length}
                page={sessionsPage}
                onPageChange={(event, newPage) => setSessionsPage(newPage)}
                rowsPerPage={sessionsRowsPerPage}
                onRowsPerPageChange={(event) => {
                  setSessionsRowsPerPage(parseInt(event.target.value, 10));
                  setSessionsPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No sessions available
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PersonAddIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6">Enroll Students in {classDetail?.sectionCode}</Typography>
            </div>
            <Button
              variant="contained"
              onClick={handleOpenImportStudents}
              startIcon={<PersonAddIcon />}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
                py: 1
              }}
            >
              Import Students
            </Button>
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

      {/* Assign Lecturer Modal */}
      <Dialog
        open={assignLecturerOpen}
        onClose={handleCloseAssignLecturer}
        maxWidth="sm"
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
            <PersonIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6">Assign Lecturer for {classDetail?.sectionCode}</Typography>
          </Box>
          <Button onClick={handleCloseAssignLecturer} sx={{ minWidth: "auto", p: 1 }}>
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Lecturer</InputLabel>
                <Select
                  label="Lecturer"
                  value={selectedLecturerId}
                  onChange={(e) => setSelectedLecturerId(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  }
                >
                  {usersLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} /> Loading lecturers...
                    </MenuItem>
                  ) : lecturers.length > 0 ? (
                    lecturers.map((lec) => (
                      <MenuItem key={lec.UserId} value={lec.UserId}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body1">{lec.FullName}</Typography>
                          {lec.Email && (
                            <Typography variant="caption" color="text.secondary">
                              {lec.Email}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No lecturers available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseAssignLecturer}
            variant="outlined"
            disabled={assigningLecturer}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAssignLecturer}
            variant="contained"
            disabled={!selectedLecturerId || assigningLecturer}
            startIcon={assigningLecturer ? <CircularProgress size={16} /> : <PersonIcon />}
          >
            {assigningLecturer ? "Assigning..." : "Assign Lecturer"}
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
            {editingScheduleId ? (
              <EditIcon sx={{ color: "secondary.main" }} />
            ) : (
              <AddIcon sx={{ color: "secondary.main" }} />
            )}
            <Typography variant="h6">
              {editingScheduleId ? "Edit" : "Add"} Schedule for {classDetail?.sectionCode}
            </Typography>
          </Box>
          <Button onClick={handleCloseAddScheduleModal} sx={{ minWidth: "auto", p: 1 }}>
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ pt: 0, mt: 0 }}>
          <Grid container spacing={3}>
            <div style={{ display: "flex", width: '100%', height: '10px' }}>
            </div>
            {/* Room Selection */}
            <Grid item xs={12} md={6} style={{ pt: 10 }}>
              <FormControl fullWidth>
                <InputLabel id="room-select-label">Room</InputLabel>
                <Select
                  labelId="room-select-label"
                  id="room-select"
                  value={scheduleForm.roomId}
                  onChange={(e) => handleScheduleFormChange("roomId", e.target.value)}
                  input={
                    <OutlinedInput
                      label="Room"
                      startAdornment={
                        <InputAdornment position="start">
                          <RoomIcon />
                        </InputAdornment>
                      }
                    />
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
                <InputLabel id="weekday-select-label">Week Day</InputLabel>
                <Select
                  labelId="weekday-select-label"
                  id="weekday-select"
                  value={scheduleForm.weekDay}
                  onChange={(e) => handleScheduleFormChange("weekDay", e.target.value)}
                  input={
                    <OutlinedInput
                      label="Week Day"
                      startAdornment={
                        <InputAdornment position="start">
                          <CalendarTodayIcon />
                        </InputAdornment>
                      }
                    />
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
            startIcon={
              addingSchedule ? (
                <CircularProgress size={16} />
              ) : editingScheduleId ? (
                <EditIcon />
              ) : (
                <AddIcon />
              )
            }
          >
            {addingSchedule
              ? editingScheduleId
                ? "Saving..."
                : "Adding..."
              : editingScheduleId
              ? "Save Changes"
              : "Add Schedule"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Schedule */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this schedule?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteSchedule}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Session Modal */}
      <Dialog
        open={editSessionOpen}
        onClose={() => setEditSessionOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle>Edit Session</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Lecturer</InputLabel>
                <Select
                  label="Lecturer"
                  value={sessionForm.lecturerId}
                  onChange={(e) => handleSessionFormChange("lecturerId", e.target.value)}
                >
                  {usersLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : lecturers.length > 0 ? (
                    lecturers.map((lec) => (
                      <MenuItem key={lec.UserId} value={lec.UserId}>
                        {lec.FullName} {lec.Email ? `- ${lec.Email}` : ""}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No lecturers available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={sessionForm.startTime}
                onChange={(e) => handleSessionFormChange("startTime", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                value={sessionForm.endTime}
                onChange={(e) => handleSessionFormChange("endTime", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Absent Grace Hours"
                value={sessionForm.sessionConfigs.absentReportGracePeriodHours}
                onChange={(e) => handleSessionFormChange("sessionConfigs.absentReportGracePeriodHours", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Attendance Rounds"
                value={sessionForm.sessionConfigs.totalAttendanceRounds}
                onChange={(e) => handleSessionFormChange("sessionConfigs.totalAttendanceRounds", e.target.value)}
              />
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setEditSessionOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveSession} startIcon={<EditIcon />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Session */}
      <Dialog
        open={Boolean(deletingSession)}
        onClose={() => setDeletingSession(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this session?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setDeletingSession(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSession}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Enrollment */}
      <Dialog
        open={Boolean(deletingEnrollment)}
        onClose={() => setDeletingEnrollment(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle>Confirm remove</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this student from the class?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setDeletingEnrollment(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteEnrollment}
            startIcon={removingEnrollment ? <CircularProgress size={16} /> : <DeleteIcon />}
            disabled={removingEnrollment}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Students Modal */}
      <Dialog
        open={importStudentsOpen}
        onClose={handleCloseImportStudents}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px", p: 1 } }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" component="div">
            Import Students
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              sx={{ alignSelf: "flex-start" }}
              startIcon={<UploadFileIcon />}
            >
              Choose CSV File
              <input
                hidden
                type="file"
                accept=".csv"
                onChange={(e) => setImportStudentsFile(e.target.files?.[0] || null)}
              />
            </Button>
            <Typography variant="body2" color="text.secondary">
              {importStudentsFile ? `Selected: ${importStudentsFile.name}` : "No file selected"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseImportStudents}
            color="inherit"
            sx={{ borderRadius: "8px", textTransform: "none", px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImportStudentsSubmit}
            variant="contained"
            disabled={!importStudentsFile || importingStudents}
            sx={{ borderRadius: "8px", textTransform: "none", px: 3 }}
          >
            {importingStudents ? <CircularProgress size={20} color="inherit" /> : "Import"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Schedules Modal */}
      <Dialog
        open={importSchedulesOpen}
        onClose={handleCloseImportSchedules}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px", p: 1 } }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" component="div">
            Import Schedules
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              sx={{ alignSelf: "flex-start" }}
              startIcon={<UploadFileIcon />}
            >
              Choose CSV File
              <input
                hidden
                type="file"
                accept=".csv"
                onChange={(e) => setImportSchedulesFile(e.target.files?.[0] || null)}
              />
            </Button>
            <Typography variant="body2" color="text.secondary">
              {importSchedulesFile ? `Selected: ${importSchedulesFile.name}` : "No file selected"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseImportSchedules}
            color="inherit"
            sx={{ borderRadius: "8px", textTransform: "none", px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImportSchedulesSubmit}
            variant="contained"
            disabled={!importSchedulesFile || importingSchedules}
            sx={{ borderRadius: "8px", textTransform: "none", px: 3 }}
          >
            {importingSchedules ? <CircularProgress size={20} color="inherit" /> : "Import"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassDetailPage;
