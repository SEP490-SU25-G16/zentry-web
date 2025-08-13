import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookIcon from "@mui/icons-material/Book";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HelpIcon from "@mui/icons-material/Help";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Switch,
  Typography
} from "@mui/material";
import { instance } from "lib/axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useClasses } from "../hooks";

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

  getSessionDetailReal: async (sessionId) => {
    try {
      const { data } = await instance.get(`/attendance/sessions/${sessionId}/details`);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error changing attendance:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.Error?.Message : "Network Error"
      };
    }
  },

  // updateAttendance removed (unused)
};

const SessionDetailPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { changeAttendance } = useClasses();

  const [sessionDetail, setSessionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmChange, setConfirmChange] = useState({ open: false, studentId: null, newStatus: "" });

  // Helper function to normalize attendance status
  const normalizeStatus = (status) => status || "future";

  const fetchSessionDetail = useCallback(async (refresh = true) => {
    if (!sessionId) return;

    refresh && setLoading(true);
    !refresh && setIsRefreshing(true);
    setError(null);

    try {
      const result = await SessionAttendanceService.getSessionDetailReal(sessionId);
      setSessionDetail(result.data?.Data);
    } catch (err) {
      console.error("Error fetching session details:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSessionDetail();
  }, [fetchSessionDetail]);

  const handleAttendanceChange = async (studentId, newStatus) => {
    setUpdating((prev) => ({ ...prev, [studentId]: true }));

    try {
      const result = await changeAttendance(
        sessionId,
        studentId,
        newStatus
      );

      if (result.success) {
        fetchSessionDetail(false);

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

  const requestAttendanceChange = (studentId, currentStatus, checked) => {
    const nextStatus = checked ? "Present" : "Absent";
    if (nextStatus === currentStatus) return;
    setConfirmChange({ open: true, studentId, newStatus: nextStatus });
  };

  const handleConfirmChange = async () => {
    const { studentId, newStatus } = confirmChange;
    setConfirmChange({ open: false, studentId: null, newStatus: "" });
    if (studentId && newStatus) {
      await handleAttendanceChange(studentId, newStatus);
    }
  };

  const handleCancelChange = () => {
    setConfirmChange({ open: false, studentId: null, newStatus: "" });
  };

  // status icon helper removed (unused)

  // Removed getStatusColor (unused)

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Derive normalized view model from API shape { SessionInfo, Students }
  const info = sessionDetail?.SessionInfo;
  const students = sessionDetail?.Students || [];
  const weekDay = info?.SessionDate
    ? new Date(info.SessionDate).toLocaleDateString("en-US", { weekday: "long" })
    : "";
  const classInfo = students?.[0]?.ClassInfo || "";

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
    total: students.length,
    attended: students.filter((s) => normalizeStatus(s.AttendanceStatus) === "attended").length,
    absented: students.filter((s) => normalizeStatus(s.AttendanceStatus) === "absent").length,
    future: students.filter((s) => normalizeStatus(s.AttendanceStatus) === "future").length,
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
          {info?.SessionName || `Session ${info?.SessionNumber || ""}` || "Session Detail"}
        </Typography>
        {weekDay && (
          <Chip label={weekDay} color="primary" variant="outlined" size="medium" sx={{ mr: 1 }} />
        )}
        {info?.Status && (
          <Chip label={info.Status} color={info.Status === "Completed" ? "success" : "warning"} size="medium" />
        )}
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
                {formatDate(info?.SessionDate)}
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
                {info?.SessionTime} - {info?.EndTime}
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
                {info?.RoomInfo || "N/A"}
              </Typography>
            </Grid>

            {/* Class / Course Info (if available) */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BookIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Class / Course
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={500}>
                {classInfo || "N/A"}
              </Typography>
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <HelpIcon sx={{ color: "text.secondary", mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
              </Box>
              <Chip label={info?.Status || "Unknown"} color={info?.Status === "Completed" ? "success" : "warning"} />
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

          {isRefreshing ? <CircularProgress /> : <List>
            {students.map((student, index) => {
              return (
                <React.Fragment key={student.StudentId}>
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
                      <Avatar sx={{ bgcolor: "primary.main" }}>{(student.FullName || "").charAt(0) || "S"}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {student.FullName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {student.Email}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {/* {getStatusIcon(normalizedStatus)} */}
                      {student.AttendanceStatus === "future" ? (
                        <Chip label="Future" color="warning" />
                      ) : (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={(student.AttendanceStatus || "future") === "present"}
                              onChange={(e) =>
                                requestAttendanceChange(
                                  student.StudentId,
                                  student.AttendanceStatus,
                                  e.target.checked
                                )
                              }
                              disabled={updating[student.StudentId]}
                            />
                          }
                          label={(student.AttendanceStatus || "future") === "present" ? "Present" : "Absent"}
                        />
                      )}
                      {updating[student.StudentId] && <CircularProgress size={20} />}
                    </Box>
                  </ListItem>
                  {index < students.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>}
        </CardContent>
      </Card>

      <Dialog open={confirmChange.open} onClose={handleCancelChange}>
        <DialogTitle>Xác nhận cập nhật</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Bạn có chắc muốn đổi trạng thái điểm danh thành "{confirmChange.newStatus}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelChange}>Hủy</Button>
          <Button onClick={handleConfirmChange} variant="contained">Xác nhận</Button>
        </DialogActions>
      </Dialog>

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
