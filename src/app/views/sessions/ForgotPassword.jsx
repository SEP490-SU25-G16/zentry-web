import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "services/auth.service";

// STYLED COMPONENTS
const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    margin: "1rem",
    borderRadius: 12
  },
  ".img-wrapper": {
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const ContentBox = styled("div")(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default
}));

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      enqueueSnackbar("Please enter your email", { variant: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await AuthService.requestPasswordReset(email.trim());
      if (res.error) {
        enqueueSnackbar(typeof res.error === "string" ? res.error : "Network error", {
          variant: "error"
        });
      } else {
        enqueueSnackbar("Password reset email sent if account exists.", {
          variant: "success"
        });
      }
    } catch {
      enqueueSnackbar("Some error occurred", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledRoot>
      <Card className="card">
        <div className="img-wrapper">
          <img width="300" src="/assets/images/illustrations/dreamer.svg" alt="Illustration" />
        </div>

        <ContentBox>
          <form onSubmit={handleFormSubmit}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Forgot Password
            </Typography>
            <TextField
              type="email"
              name="email"
              size="small"
              label="Email"
              value={email}
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3, width: "100%" }}
              required
            />

            <Button fullWidth variant="contained" color="primary" type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Reset Password"}
            </Button>

            <Button
              fullWidth
              color="primary"
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ mt: 2 }}>
              Go Back
            </Button>
          </form>
        </ContentBox>
      </Card>
    </StyledRoot>
  );
}
