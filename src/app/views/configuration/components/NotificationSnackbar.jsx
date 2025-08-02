import React from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationSnackbar = ({ snackbar, onClose }) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled">
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
