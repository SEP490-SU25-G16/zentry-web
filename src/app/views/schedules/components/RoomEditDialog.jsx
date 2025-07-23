import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";

const RoomEditDialog = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({ roomName: "", building: "", capacity: "" });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit Room</DialogTitle>
      <DialogContent>
        <TextField
          name="roomName"
          label="Room Name"
          fullWidth
          margin="dense"
          value={form.roomName}
          onChange={handleChange}
        />
        <TextField
          name="building"
          label="Building"
          fullWidth
          margin="dense"
          value={form.building}
          onChange={handleChange}
        />
        <TextField
          name="capacity"
          label="Capacity"
          type="number"
          fullWidth
          margin="dense"
          value={form.capacity}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomEditDialog;
