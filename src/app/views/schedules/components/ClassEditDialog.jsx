import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@mui/material";

const ClassEditDialog = ({ open, initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    courseName: "",
    lecturerName: "",
    sectionCode: "",
    semester: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{formData.id ? "Edit Class" : "Add Class"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Course Name"
          name="courseName"
          fullWidth
          value={formData.courseName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Lecturer Name"
          name="lecturerName"
          fullWidth
          value={formData.lecturerName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Section Code"
          name="sectionCode"
          fullWidth
          value={formData.sectionCode}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Semester"
          name="semester"
          fullWidth
          value={formData.semester}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClassEditDialog;
