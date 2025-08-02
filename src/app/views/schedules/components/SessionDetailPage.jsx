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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RoomIcon from "@mui/icons-material/Room";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";

// Mock API service for session attendance
const SessionAttendanceService = {
  getSessionDetail: async (sessionId, classId) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data based on the schedule from class detail
    const sessionData = {
      id: sessionId,
      classId: classId,
      date: "2025-08-04", // Match the schedule start date
      topic: "Network Basics",
      startTime: "13:00", // Match schedule times
      endTime: "14:00",
      weekDay: "Monday",
      roomName: "C109",
      courseName: "Fantastic circuit solid state",
      courseCode: "FAC402",
      sectionCode: "FAC402-01",
      lecturerName: "Ông Văn Trung",
      lecturerEmail: "ng.vn.trung.lecturer9@zentry.edu",
      attendance: [
        {
          studentId: "stu1",
          name: "Alice Nguyen",
          email: "alice.nguyen@student.zentry.edu",
          status: "future",
          avatar: null
        },
        {
          studentId: "stu2",
          name: "Bob Tran",
          email: "bob.tran@student.zentry.edu",
          status: "future",
          avatar: null
        },
        {
          studentId: "stu3",
          name: "Charlie Le",
          email: "charlie.le@student.zentry.edu",
          status: "attended",
          avatar: null
        },
        {
          studentId: "stu4",
          name: "David Pham",
          email: "david.pham@student.zentry.edu",
          status: "attended",
          avatar: null
        },
        {
          studentId: "stu5",
          name: "Emma Vo",
          email: "emma.vo@student.zentry.edu",
          status: "absented",
          avatar: null
        },
        {
          studentId: "stu6",
          name: "Frank Nguyen",
          email: "frank.nguyen@student.zentry.edu",
          status: "future",
          avatar: null
        },
        {
          studentId: "stu7",
          name: "Grace Tran",
          email: "grace.tran@student.zentry.edu",
          status: "attended",
          avatar: null
        },
        {
          studentId: "stu8",
          name: "Henry Le",
          email: "henry.le@student.zentry.edu",
          status: "absented",
          avatar: null
        },
        {
          studentId: "stu9",
          name: "Iris Pham",
          email: "iris.pham@student.zentry.edu",
          status: null, // No status - should default to "future"
          avatar: null
        },
        {
          studentId: "stu10",
          name: "Jack Vo",
          email: "jack.vo@student.zentry.edu",
          status: undefined, // Undefined status - should default to "future"
          avatar: null
        },
        {
          studentId: "stu11",
          name: "Kelly Nguyen",
          email: "kelly.nguyen@student.zentry.edu",
          // Missing status property - should default to "future"
          avatar: null
        }
      ]
    };

    // Ensure all students have a valid status, defaulting to "future" if none exists
    sessionData.attendance = sessionData.attendance.map((student) => ({
      ...student,
      status: student.status || "future"
    }));

    return {
      success: true,
      data: sessionData
    };
  },

  updateAttendance: async (sessionId, studentId, status) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      message: `Attendance updated successfully`
    };
  }
};

const SessionDetailPage = () => {
  const { classId, sessionId } = useParams();
  const navigate = useNavigate();

  const [sessionDetail, setSessionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Helper function to normalize attendance status
  const normalizeStatus = (status) => {
    return status || "future";
  };

  useEffect(() => {
    fetchSessionDetail();
  }, [sessionId]);

  const fetchSessionDetail = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await SessionAttendanceService.getSessionDetail(sessionId, classId);

      if (result.success) {
        // Normalize all student statuses to ensure they have valid values
        const normalizedSessionDetail = {
          ...result.data,
          attendance: result.data.attendance.map((student) => ({
            ...student,
            status: normalizeStatus(student.status)
          }))
        };
        setSessionDetail(normalizedSessionDetail);
      } else {
        setError(result.error || "Failed to fetch session details");
      }
    } catch (err) {
      console.error("Error fetching session details:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (studentId, newStatus) => {
    setUpdating((prev) => ({ ...prev, [studentId]: true }));

    try {
      const result = await SessionAttendanceService.updateAttendance(
        sessionId,
        studentId,
        newStatus
      );

      if (result.success) {
        // Update local state
        setSessionDetail((prev) => ({
          ...prev,
          attendance: prev.attendance.map((student) =>
            student.studentId === studentId
              ? { ...student, status: normalizeStatus(newStatus) }
              : student
          )
        }));

        setSnackbar({
          open: true,
          message: "Attendance updated successfully",
          severity: "success"
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update attendance",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while updating attendance",
        severity: "error"
      });
    } finally {
      setUpdating((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "attended":
        return <CheckCircleIcon sx={{ color: "success.main" }} />;
      case "absented":
        return <CancelIcon sx={{ color: "error.main" }} />;
      case "future":
        return <HelpIcon sx={{ color: "grey.500" }} />;
      default:
        return <HelpIcon sx={{ color: "grey.500" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "attended":
        return "success";
      case "absented":
        return "error";
      case "future":
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
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
          Loading session details...
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
        <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!sessionDetail) {
    return (
      <Box sx={{ m: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Session not found
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
      </Box>
    );
  }

  // Calculate attendance statistics
  const attendanceStats = {
    total: sessionDetail.attendance.length,
    attended: sessionDetail.attendance.filter((s) => normalizeStatus(s.status) === "attended")
      .length,
    absented: sessionDetail.attendance.filter((s) => normalizeStatus(s.status) === "absented")
      .length,
    future: sessionDetail.attendance.filter((s) => normalizeStatus(s.status) === "future").length
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{ minWidth: "auto" }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Session Detail
        </Typography>
        <Chip label={sessionDetail.weekDay} color="primary" variant="outlined" size="medium" />
      </Box>

      {/* Session Information Card */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CalendarTodayIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
            <Typography variant="h5" component="h2" fontWeight={600}>
              Session Information
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Date */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarTodayIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Date
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {formatDate(sessionDetail.date)}
              </Typography>
            </Grid>

            {/* Time */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccessTimeIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Time
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {sessionDetail.startTime} - {sessionDetail.endTime}
              </Typography>
            </Grid>

            {/* Topic */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BookIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Topic
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {sessionDetail.topic}
              </Typography>
            </Grid>

            {/* Room */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <RoomIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Room
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {sessionDetail.roomName}
              </Typography>
            </Grid>

            {/* Course */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BookIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Course
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {sessionDetail.courseName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sessionDetail.courseCode} - {sessionDetail.sectionCode}
              </Typography>
            </Grid>

            {/* Lecturer */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Lecturer
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {sessionDetail.lecturerName}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Attendance Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" color="primary.main" fontWeight={600}>
              {attendanceStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Students
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" color="success.main" fontWeight={600}>
              {attendanceStats.attended}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Attended
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" color="error.main" fontWeight={600}>
              {attendanceStats.absented}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Absent
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" color="grey.500" fontWeight={600}>
              {attendanceStats.future}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Future
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Student Attendance */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <PersonIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
            <Typography variant="h5" component="h2" fontWeight={600}>
              Student Attendance
            </Typography>
          </Box>

          <List>
            {sessionDetail.attendance.map((student, index) => {
              const normalizedStatus = normalizeStatus(student.status);
              return (
                <React.Fragment key={student.studentId}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 2,
                      borderRadius: "8px",
                      mb: 1,
                      backgroundColor: "grey.50"
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>{student.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {student.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {student.email}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {getStatusIcon(normalizedStatus)}
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={normalizedStatus}
                          onChange={(e) =>
                            handleAttendanceChange(student.studentId, e.target.value)
                          }
                          disabled={updating[student.studentId]}
                        >
                          <MenuItem value="future">future</MenuItem>
                          <MenuItem value="attended">attended</MenuItem>
                          <MenuItem value="absented">absented</MenuItem>
                        </Select>
                      </FormControl>
                      {updating[student.studentId] && <CircularProgress size={20} />}
                    </Box>
                  </ListItem>
                  {index < sessionDetail.attendance.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default SessionDetailPage;
