import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
// ROOT THEME PROVIDER
import { MatxTheme } from "./components";
// ALL CONTEXTS
import SettingsProvider from "./contexts/SettingsContext";
import { AuthProvider } from "./contexts/FirebaseAuthContext";
// ROUTES
import routes from "./routes";
// FAKE SERVER
import "../__api__";
import AppLoadingProvider from "./contexts/AppLoadingContext";
import { SnackbarProvider } from "notistack";

export default function App() {
  const content = useRoutes(routes);

  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <AppLoadingProvider>
        <SettingsProvider>
          <AuthProvider>
            <MatxTheme>
              <CssBaseline />
              {content}
            </MatxTheme>
          </AuthProvider>
        </SettingsProvider>
      </AppLoadingProvider>
    </SnackbarProvider>
  );
}
