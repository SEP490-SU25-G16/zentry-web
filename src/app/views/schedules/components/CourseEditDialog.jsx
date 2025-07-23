import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";

const CourseEditDialog = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({ code: "", name: "", description: "", semester: "" });

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Course</DialogTitle>
      <DialogContent>
        <TextField
          name="code"
          label="Code"
          fullWidth
          margin="dense"
          value={form.code}
          onChange={handleChange}
        />
        <TextField
          name="name"
          label="Name"
          fullWidth
          margin="dense"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="dense"
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          name="semester"
          label="Semester"
          fullWidth
          margin="dense"
          value={form.semester}
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

export default CourseEditDialog;
