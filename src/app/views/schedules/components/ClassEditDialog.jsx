import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

const ClassEditDialog = ({ open, initialData, onClose, onSave, courses = [], lecturers = [] }) => {
  const [formData, setFormData] = useState({
    id: "",
    courseId: "",
    lecturerId: "",
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
    const { name, value } = e.target;

    if (name === "courseName") {
      // Find the course and update courseId
      const course = courses.find((c) => `${c.Code} - ${c.Name}` === value);
      setFormData((prev) => ({
        ...prev,
        courseName: value,
        courseId: course?.Id || ""
      }));
    } else if (name === "lecturerName") {
      // Find the lecturer and update lecturerId
      const lecturer = lecturers.find((l) => l.FullName === value);
      setFormData((prev) => ({
        ...prev,
        lecturerName: value,
        lecturerId: lecturer?.UserId || ""
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formData.id ? "Edit Class" : "Add Class"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Course</InputLabel>
          <Select
            name="courseName"
            value={formData.courseName || ""}
            onChange={handleChange}
            label="Course"
          >
            {courses.map((course) => (
              <MenuItem key={course.Id} value={`${course.Code} - ${course.Name}`}>
                {course.Code} - {course.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Lecturer</InputLabel>
          <Select
            name="lecturerName"
            value={formData.lecturerName || ""}
            onChange={handleChange}
            label="Lecturer"
          >
            {lecturers.map((lecturer) => (
              <MenuItem key={lecturer.UserId} value={lecturer.FullName}>
                {lecturer.FullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Section Code"
          name="sectionCode"
          fullWidth
          value={formData.sectionCode || ""}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          label="Semester"
          name="semester"
          fullWidth
          value={formData.semester || ""}
          onChange={handleChange}
          placeholder="e.g., SP25, FA24, SU25"
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
