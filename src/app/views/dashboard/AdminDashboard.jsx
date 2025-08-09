import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClassIcon from "@mui/icons-material/Class";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Card, CardContent, Chip, Divider, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";

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
          <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
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

const AdminDashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [tab, setTab] = useState("students");

  const primaryData = useMemo(() => {
    if (tab === "students") return [{ label: "Spring", value: 220 }, { label: "Summer", value: 180 }, { label: "Fall", value: 210 }];
    if (tab === "classes") return [{ label: "Spring", value: 45 }, { label: "Summer", value: 38 }, { label: "Fall", value: 42 }];
    return [{ label: "Spring", value: 85 }, { label: "Summer", value: 88 }, { label: "Fall", value: 87 }];
  }, [tab]);

  // No separate dataset; when tab === 'attendance', primaryData are % values

  const chartOption = useMemo(() => {
    const categories = ["Spring", "Summer", "Fall"]; 
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
            data: primaryData.map((d) => d.value),
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

    const present = primaryData.map((d) => d.value);
    const absent = present.map((p) => 100 - p);

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
  }, [tab, primaryData]);

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          {/* Greeting + quick search */}
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="h5">Hello Daniel</Typography>
                  <TextField
                    placeholder="Sub......"
                    size="small"
                    sx={{ mt: 1, width: 320 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Week
                  </Typography>
                  <Typography variant="h5">11</Typography>
                </Box>
              </Stack>
              <TextField
                fullWidth
                placeholder="Search here..."
                sx={{ mt: 3 }}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              />
            </CardContent>
          </Card>

          {/* Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MetricCard icon={<MeetingRoomIcon />} label="Rooms" value={50} />
            </Grid>
            <Grid item xs={12} md={4}>
              <MetricCard icon={<SchoolIcon />} label="Courses" value={76} />
            </Grid>
            <Grid item xs={12} md={4}>
              <MetricCard icon={<ClassIcon />} label="Classes" value={235} />
            </Grid>
          </Grid>

          {/* Chart section (single area, changes by tab) */}
          <Card sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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
                <ReactECharts key={tab} style={{ height: 320 }} option={chartOption} notMerge />
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Right sidebar */}
        <Grid item xs={12} md={4} lg={3}>
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
                  <Typography variant="caption" color="text.secondary">Devices</Typography>
                  <Typography variant="h6">2034/2980</Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">Face ID</Typography>
                  <Typography variant="h6">2034/2980</Typography>
                </CardContent>
              </Card>
            </Stack>
          </SideCard>

          <SideCard title="Top 5 courses" sx={{ mt: 3 }}>
            <List dense>
              {["SE101 - 12 lớp", "SE102 - 10 lớp", "PRJ301 - 8 lớp", "MAD101 - 7 lớp", "CSD201 - 6 lớp"].map((txt) => (
                <ListItem key={txt} sx={{ px: 0 }}>
                  <TrendingUpIcon fontSize="small" color="primary" style={{ marginRight: 8 }} />
                  <ListItemText primaryTypographyProps={{ variant: "body2" }} primary={txt} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ height: 80, bgcolor: "grey.100", borderRadius: 2 }} />
          </SideCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;


