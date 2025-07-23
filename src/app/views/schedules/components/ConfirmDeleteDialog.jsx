import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

const ConfirmDeleteDialog = ({ open, onClose, onConfirm, title }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title || "Are you sure to delete this item?"}</DialogTitle>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDeleteDialog;
