import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";

const ConfirmDeleteDialog = ({ open, onClose, onConfirm, title, content }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title || "Confirm Delete"}</DialogTitle>
    {content && (
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
    )}
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDeleteDialog;
