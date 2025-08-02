import { Small } from "app/components/Typography";
import { MatxProgressBar, SimpleCard } from "app/components";
import { styled } from "@mui/material/styles";

const CampaignsContainer = styled("div")(({ theme }) => ({
  marginTop: "2rem",
  padding: "1.5rem",
  background: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
}));

const StyledCard = styled(SimpleCard)(({ theme }) => ({
  borderRadius: "14px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  padding: "1.5rem"
}));

const Title = styled("div")(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "700",
  marginBottom: "1rem",
  color: theme.palette.text.primary,
  letterSpacing: "0.5px"
}));

const ProgressWrapper = styled("div")({
  marginBottom: "1.2rem"
});

export default function Campaigns() {
  return (
    <CampaignsContainer>
      <StyledCard>
        <Title>Semester Progress</Title>
        <Small color="text.secondary" sx={{ marginBottom: "1rem", display: "block" }}>
          Week 1
        </Small>
        <ProgressWrapper>
          <MatxProgressBar value={75} color="primary" text="Attendance (75%)" />
        </ProgressWrapper>
        <ProgressWrapper>
          <MatxProgressBar value={45} color="secondary" text="Absent (45%)" />
        </ProgressWrapper>
        <ProgressWrapper>
          <MatxProgressBar value={75} color="primary" text="Progress (75%)" />
        </ProgressWrapper>
      </StyledCard>
    </CampaignsContainer>
  );
}
