import CssBaseline from "@mui/material/CssBaseline";
import { useRoutes } from "react-router-dom";
// ROOT THEME PROVIDER
import { MatxTheme } from "./components";
// ALL CONTEXTS
import { AuthProvider } from "./contexts/ApiAuthContext";
import SettingsProvider from "./contexts/SettingsContext";
// ROUTES
import routes from "./routes";
// FAKE SERVER
import { SnackbarProvider } from "notistack";
import "../__api__";
import AppLoadingProvider from "./contexts/AppLoadingContext";

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
