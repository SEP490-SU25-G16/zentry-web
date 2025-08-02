import { Fragment } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { styled, useTheme } from "@mui/material/styles";

import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import DoughnutChart from "./shared/Doughnut";
import CourseBarChart from "./shared/CourseBarChart";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "2rem",
  // background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  borderRadius: "20px",
  [theme.breakpoints.down("sm")]: { margin: "1rem" }
}));

const Title = styled("span")(() => ({
  fontSize: "1.25rem",
  fontWeight: "700",
  marginRight: ".5rem",
  textTransform: "capitalize",
  display: "block",
  marginBottom: "0.75rem",
  letterSpacing: "0.5px"
}));

const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "1.05rem",
  color: theme.palette.text.secondary,
  marginBottom: "1.25rem",
  display: "block",
  fontWeight: "500"
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: "600",
  marginBottom: "1rem",
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: "2rem 1.5rem",
  borderRadius: "18px",
  boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
  border: `1px solid ${theme.palette.divider}`,
  // background: "#fff",
  transition: "box-shadow 0.25s, transform 0.2s",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
    transform: "scale(1.03)"
  }
}));

export default function Analytics() {
  const { palette } = useTheme();

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <StatCards />
            <Campaigns />
            <CourseBarChart />
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledCard>
              <Title>Average Attendance Percent</Title>
              <SubTitle>SEMESTER SUMMER25</SubTitle>
              <DoughnutChart height="300px" color={["#4CAF50", "#f44336"]} />
            </StyledCard>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
