import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import * as Yup from "yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { styled, useTheme } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
// GLOBAL CUSTOM COMPONENTS
import MatxLogo from "app/components/MatxLogo";
import MatxDivider from "app/components/MatxDivider";
import { Paragraph, Span } from "app/components/Typography";
// GLOBAL CUSTOM HOOKS
import useAuth from "app/hooks/useAuth";

// STYLED COMPONENTS
const SplitScreenRoot = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  color: "white",
  padding: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url(/assets/images/bg-3.png) no-repeat center",
    backgroundSize: "cover",
    opacity: 0.1,
    zIndex: 0
  },
  "& > *": {
    position: "relative",
    zIndex: 1
  },
  [theme.breakpoints.down("md")]: {
    display: "none"
  }
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  padding: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flex: "none",
    width: "100%"
  }
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 400,
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  border: "1px solid #eee",
  borderRadius: theme.spacing(2)
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.87)",
  backgroundColor: "#f5f5f5",
  border: "1px solid #dadce0",
  boxShadow: "none",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#f1f3f4",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  }
}));

const Logo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 32,
  "& span": {
    fontSize: 32,
    fontWeight: 700,
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  }
});

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& .feature-icon": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    marginRight: theme.spacing(2)
  }
}));

// initial login credentials
const initialValues = {
  email: "jason@ui-lib.com",
  password: "dummyPass",
  remember: true
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string().email("Invalid Email address").required("Email is required!")
});

export default function FirebaseLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const handleFormSubmit = async (values) => {
    try {
      await signInWithEmail(values.email, values.password);
      navigate(state ? state.from : "/");
      enqueueSnackbar("Logged In Successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SplitScreenRoot>
      {/* Left Panel - Branding & Features */}
      <LeftPanel>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Logo>
            <MatxLogo sx={{ width: 48, height: 48 }} />
            <Typography variant="h4" component="span">
              Zentry
            </Typography>
          </Logo>

          <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
            Welcome Back
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
            Professional Admin Dashboard
          </Typography>

          <Box sx={{ textAlign: "left", mb: 4 }}>
            <FeatureItem>
              <div className="feature-icon" />
              <Typography variant="body1">JWT, Firebase & Auth0 Authentication</Typography>
            </FeatureItem>
            <FeatureItem>
              <div className="feature-icon" />
              <Typography variant="body1">Clean & Organized Code</Typography>
            </FeatureItem>
            <FeatureItem>
              <div className="feature-icon" />
              <Typography variant="body1">Limitless Pages & Components</Typography>
            </FeatureItem>
          </Box>

          <Box sx={{ mt: "auto" }}>
            <img
              src="/assets/images/logos/ui-lib.png"
              alt="UI Lib Logo"
              style={{ width: 40, height: 40, opacity: 0.8 }}
            />
          </Box>
        </Container>
      </LeftPanel>

      {/* Right Panel - Login Form */}
      <RightPanel>
        <LoginCard elevation={0}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          </Box>

          <GoogleButton
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            startIcon={<img src="/assets/images/logos/google.svg" alt="google" width="20" />}
            sx={{ mb: 3, py: 1.5 }}
          >
            Continue with Google
          </GoogleButton>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ mx: 2, color: "text.secondary" }}>
              or
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  size="medium"
                  type="email"
                  name="email"
                  label="Email Address"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.email}
                  onChange={handleChange}
                  helperText={touched.email && errors.email}
                  error={Boolean(errors.email && touched.email)}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  size="medium"
                  name="password"
                  type="password"
                  label="Password"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={handleChange}
                  helperText={touched.password && errors.password}
                  error={Boolean(errors.password && touched.password)}
                  sx={{ mb: 2 }}
                />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      size="small"
                      name="remember"
                      onChange={handleChange}
                      checked={values.remember}
                    />
                    <Typography variant="body2">Remember me</Typography>
                  </Box>

                  <NavLink
                    to="/session/forgot-password"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      fontSize: "0.875rem"
                    }}
                  >
                    Forgot password?
                  </NavLink>
                </Box>

                <LoadingButton
                  type="submit"
                  fullWidth
                  size="large"
                  loading={isSubmitting}
                  variant="contained"
                  sx={{
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    background: "#635bff"
                  }}
                >
                  Sign In
                </LoadingButton>
              </form>
            )}
          </Formik>
        </LoginCard>
      </RightPanel>
    </SplitScreenRoot>
  );
}
