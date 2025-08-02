import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { Box, CircularProgress, Backdrop, Typography } from "@mui/material";

const AppLoadingContext = createContext();

const AppLoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <AppLoadingContext.Provider value={{ loading, setLoading }}>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: 22222222,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
        open={loading}
      >
        <CircularProgress
          color="primary"
          size={60}
          thickness={4}
          sx={{
            color: "#1976d2"
          }}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: "white",
            fontWeight: 500,
            letterSpacing: "0.5px"
          }}
        >
          Loading...
        </Typography>
      </Backdrop>
      {children}
    </AppLoadingContext.Provider>
  );
};

export const useAppLoadingContext = () => {
  const context = useContext(AppLoadingContext);
  if (!context) {
    throw new Error("useAppLoading must be used within an AppLoadingProvider");
  }
  return context;
};

export default AppLoadingProvider;
