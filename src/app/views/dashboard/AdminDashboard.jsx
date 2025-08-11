import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClassIcon from "@mui/icons-material/Class";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography
} from "@mui/material";
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
        <Box sx={{ p: 1.2, bgcolor: "grey.100", borderRadius: 2 }}>{icon}</Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6">{value}</Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const SideCard = ({ title, children, sx }) => (
  <Card sx={{ borderRadius: 3, ...sx }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
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
  const [totals, setTotals] = useState({ rooms: 0, courses: 0, classes: 0, devices: 0, faceId: 0 });
  const [topFiveCourse, setTopFiveCourse] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const [chartValues, setChartValues] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  const { user } = useAuth();

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
      console.log("🚀 ~ fetchSchema ~ schema:", schema)
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
    const [classes, student, attendance] = await Promise.all([getClass(year), getStudent(year), getAttendance(year)]);
    return {
      class: classes.data?.Data,
      student: student.data?.Data,
      attendance: attendance.data?.Data
    };
  };

  const fetchData = async () => {
    const [rooms, courses, classes, devices] = await Promise.all([
      instance.get("/rooms/total-rooms"),
      instance.get("/courses/total-courses"),
      instance.get("/class-sections/total-class-sections"),
      instance.get("/devices/total-devices")
    ]);
    return {
      rooms: rooms.data?.Data,
      courses: courses.data?.Data,
      classes: classes.data?.Data,
      devices: devices.data?.Data?.TotalDevices,
      faceId: 0
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
                  { offset: 0, color: "#80d8ff" },
                  { offset: 1, color: "#6ab7ff" }
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
          itemStyle: { color: "#81c784" }
        },
        {
          name: "Absent",
          type: "bar",
          stack: "total",
          data: absent,
          barWidth: 44,
          itemStyle: { color: "#ef9a9a" },
          label: { show: true, position: "top", formatter: ({ value }) => `${100 - value}%` }
        }
      ]
    };
  }, [tab, chartCategories, chartValues]);

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Greeting + quick search */}
          <Card sx={{ borderRadius: 3, mb: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="h5">Hello {user.name}</Typography>
                </Box>
                <Box>
                  <Chip
                    label="Week 11"
                    variant="outlined"
                    sx={{ borderRadius: 2, px: 1.5, py: 3, fontWeight: 500 }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search here..."
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 9999 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MetricCard icon={<MeetingRoomIcon />} label="Rooms" value={totals.rooms} />
            </Grid>
            <Grid item xs={12} md={4}>
              <MetricCard icon={<SchoolIcon />} label="Courses" value={totals.courses} />
            </Grid>
            <Grid item xs={12} md={4}>
              <MetricCard icon={<ClassIcon />} label="Classes" value={totals.classes} />
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
                <Typography variant="h6">Biểu đồ</Typography>
                <TogglePills value={tab} onChange={setTab} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton onClick={() => setYear((y) => y - 1)} size="small">
                    <ArrowBackIosNewIcon fontSize="inherit" />
                  </IconButton>
                  <Chip label={year} variant="outlined" />
                  <IconButton onClick={() => setYear((y) => y + 1)} size="small">
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
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Devices
                  </Typography>
                  <Typography variant="h6">{totals?.devices}</Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Face ID
                  </Typography>
                  <Typography variant="h6">23</Typography>
                </CardContent>
              </Card>
            </Stack>
          </SideCard>

          <SideCard title="Top 5 courses" sx={{ mt: 3 }}>
            <List dense>
              {topFiveCourse.map((course) => (
                <ListItem key={course.courseId} sx={{ px: 0, borderRadius: 2, border: "1px solid #e0e0e0", marginBottom: 4, padding: 2 }}>
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
