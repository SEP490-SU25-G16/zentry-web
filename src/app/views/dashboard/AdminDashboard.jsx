import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClassIcon from "@mui/icons-material/Class";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useAuth from "app/hooks/useAuth";
import dayjs from "dayjs";
import ReactECharts from "echarts-for-react";
import { instance } from "lib/axios";
import { useEffect, useMemo, useState } from "react";

// (Legacy mini chart via MUI Box was here; replaced with ECharts option above)

const TogglePills = ({ value, onChange }) => {
  return (
    <Stack direction="row" spacing={2}>
      {[
        { key: "students", label: "Student" },
        { key: "classes", label: "Classes" },
        { key: "attendance", label: "Attendance" }
      ].map((opt) => (
        <Chip
          key={opt.key}
          label={opt.label}
          color={value === opt.key ? "primary" : "default"}
          variant={value === opt.key ? "filled" : "outlined"}
          onClick={() => onChange(opt.key)}
          sx={{ borderRadius: 2 }}
        />
      ))}
    </Stack>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
            color: "primary.main",
            borderRadius: 2
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" color="text.primary">
            {value}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const SideCard = ({ title, children, sx }) => (
  <Card sx={{ borderRadius: 3, ...sx }}>
    <CardContent>
      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }} gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

// const defaultTab = {};

const AdminDashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [tab, setTab] = useState("students");
  const [totals, setTotals] = useState({
    rooms: 0,
    courses: 0,
    classes: 0,
    devices: 0,
    totalDevices: 0,
    faceId: 0,
    currentWeek: 0
  });
  const [topFiveCourse, setTopFiveCourse] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const [chartValues, setChartValues] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  const { user } = useAuth();
  const theme = useTheme();

  // Fetch chart data by tab + year
  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      try {
        let dataObj;
        if (tab === "students") dataObj = await getStudent(year);
        else if (tab === "classes") dataObj = await getClass(year);
        else dataObj = await getAttendance(year);

        const semesters = dataObj?.Semesters || {};
        const categories = Object.keys(semesters);
        const values = categories.map((k) => Number(semesters[k]) || 0);
        setChartCategories(categories);
        setChartValues(values);
      } catch {
        setChartCategories([]);
        setChartValues([]);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChartData();
  }, [year, tab]);

  useEffect(() => {
    (async () => {
      const data = await fetchData();
      setTotals(data);
      const courses = await getTopFiveCourse();
      setTopFiveCourse(courses);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const schema = await fetchSchema();
      console.log("🚀 ~ fetchSchema ~ schema:", schema);
    })();
  }, [year]);

  const getAttendance = async (year) => {
    const res = await instance.get(`/class-sections/attendance-rate/year/${year}`);
    return res.data?.Data;
  };

  const getStudent = async (year) => {
    const res = await instance.get(`/enrollments/student-count/year/${year}`);
    return res.data?.Data;
  };

  const getClass = async (year) => {
    const res = await instance.get(`/class-sections/class-section-count/year/${year}`);
    return res.data?.Data;
  };

  const getTopFiveCourse = async () => {
    const data = await instance.get("/courses/top-courses?=5");
    return data.data?.Data;
  };

  const fetchSchema = async () => {
    const [classes, student, attendance] = await Promise.all([
      getClass(year),
      getStudent(year),
      getAttendance(year)
    ]);
    return {
      class: classes.data?.Data,
      student: student.data?.Data,
      attendance: attendance.data?.Data
    };
  };

  const fetchData = async () => {
    const [rooms, courses, classes, devices, currentWeek, faceId] = await Promise.all([
      instance.get("/rooms/total-rooms"),
      instance.get("/courses/total-courses"),
      instance.get("/class-sections/total-class-sections"),
      instance.get("/devices/total-devices"),
      instance.get(`/schedules/current-week-number?date=${new Date().toISOString().split("T")[0]}`),
      instance.get("/faceid/users")
    ]);

    return {
      rooms: rooms.data?.Data,
      courses: courses.data?.Data,
      classes: classes.data?.Data,
      devices: devices.data?.Data?.ActiveDevices,
      totalDevices: devices.data?.Data?.TotalDevices,
      faceId: `${faceId.data?.Data?.Users?.map((t) => t.HasFaceId).length} / ${
        faceId.data?.Data?.TotalCount
      }`,
      currentWeek: currentWeek.data?.Data?.WeekNumber
    };
  };

  // Chart option

  const chartOption = useMemo(() => {
    const categories = chartCategories;
    const isAttendance = tab === "attendance";
    const xName = tab.charAt(0).toUpperCase() + tab.slice(1);
    const grid = { left: 56, right: 20, top: 30, bottom: 50 };

    const base = {
      tooltip: { trigger: "axis" },
      grid,
      xAxis: {
        type: "category",
        data: categories,

        axisLine: { lineStyle: { color: "#9e9e9e" } },
        axisTick: { show: true }
      },
      yAxis: {
        type: "value",
        name: xName,
        nameLocation: "middle",
        nameGap: 40,
        axisLine: { show: true, lineStyle: { color: "#9e9e9e" } },
        splitLine: { show: true, lineStyle: { type: "dashed", color: "#e0e0e0" } }
      }
    };

    if (!isAttendance) {
      return {
        ...base,
        legend: { show: false },
        series: [
          {
            type: "bar",
            data: chartValues,
            barWidth: 44,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: theme.palette.primary.light },
                  { offset: 1, color: theme.palette.primary.main }
                ]
              }
            },
            label: { show: true, position: "top" }
          }
        ]
      };
    }

    const present = chartValues;
    const absent = present.map((p) => Math.max(0, 100 - (Number(p) || 0)));

    return {
      ...base,
      yAxis: { ...base.yAxis, max: 100, axisLabel: { formatter: (v) => `${v}%` } },
      legend: { show: true, data: ["Present", "Absent"], bottom: 0 },
      series: [
        {
          name: "Present",
          type: "bar",
          stack: "total",
          data: present,
          barWidth: 44,
          itemStyle: { color: theme.palette.primary.main }
        },
        {
          name: "Absent",
          type: "bar",
          stack: "total",
          data: absent,
          barWidth: 44,
          itemStyle: { color: theme.palette.primary.light },
          label: { show: true, position: "top", formatter: ({ value }) => `${100 - value}%` }
        }
      ]
    };
  }, [tab, chartCategories, chartValues, theme]);

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Greeting + quick search */}
          <Card
            sx={{
              borderRadius: 3,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              color: "primary.contrastText"
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="h5" sx={{ color: "common.white" }}>
                    Hello {user.name}
                  </Typography>
                </Box>
                <Box>
                  <Chip
                    label={`Week ${totals?.currentWeek}`}
                    variant="filled"
                    sx={{
                      borderRadius: 2,
                      px: 1.5,
                      py: 3,
                      fontWeight: 500,
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "common.white"
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MetricCard
                icon={<MeetingRoomIcon color="inherit" />}
                label="Rooms"
                value={totals.rooms}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MetricCard
                icon={<SchoolIcon color="inherit" />}
                label="Courses"
                value={totals.courses}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MetricCard
                icon={<ClassIcon color="inherit" />}
                label="Classes"
                value={totals.classes}
              />
            </Grid>
          </Grid>

          {/* Chart section (single area, changes by tab) */}
          <Card sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2
                }}
              >
                <Typography variant="h6" color="primary">
                  Chart
                </Typography>
                <TogglePills value={tab} onChange={setTab} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton color="primary" onClick={() => setYear((y) => y - 1)} size="small">
                    <ArrowBackIosNewIcon fontSize="inherit" />
                  </IconButton>
                  <Chip label={year} color="primary" variant="outlined" />
                  <IconButton color="primary" onClick={() => setYear((y) => y + 1)} size="small">
                    <ArrowForwardIosIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
              </Box>
              <div className="p-5">
                <ReactECharts
                  key={`${tab}-${year}`}
                  style={{ height: 320 }}
                  option={chartOption}
                  notMerge
                  showLoading={chartLoading}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Right sidebar */}
        <Grid item xs={12} md={4}>
          <SideCard title="Calendar">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                defaultValue={dayjs()}
                views={["year", "month", "day"]}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  "& .MuiPickersDay-root.Mui-selected": { bgcolor: "primary.main" }
                }}
              />
            </LocalizationProvider>
          </SideCard>

          <SideCard title="Registered Statistics" sx={{ mt: 3 }}>
            <Stack spacing={2} direction="row">
              <Card variant="outlined" sx={{ borderRadius: 2, width: "50%" }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Devices
                  </Typography>
                  <Typography variant="h6">
                    {totals?.devices} / {totals?.totalDevices}
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ borderRadius: 2, width: "50%" }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Face ID
                  </Typography>
                  <Typography variant="h6">{totals?.faceId}</Typography>
                </CardContent>
              </Card>
            </Stack>
          </SideCard>

          <SideCard title="Top 5 courses" sx={{ mt: 3 }}>
            <List dense>
              {topFiveCourse.map((course) => (
                <ListItem
                  key={course.courseId}
                  sx={{
                    px: 0,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    marginBottom: 4,
                    padding: 2
                  }}
                >
                  <TrendingUpIcon fontSize="small" color="primary" style={{ marginRight: 8 }} />
                  <ListItemText
                    primaryTypographyProps={{ variant: "body2" }}
                    primary={`${course.CourseName} - ${course.ClassSectionCount} lớp`}
                  />
                </ListItem>
              ))}
            </List>
          </SideCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
