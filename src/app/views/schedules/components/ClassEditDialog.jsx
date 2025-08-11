import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";

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

        {/* {formData.id && <FormControl fullWidth margin="dense">
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
        </FormControl>} */}

        <TextField
          margin="dense"
          label="Section Code"
          name="sectionCode"
          fullWidth
          value={formData.sectionCode || ""}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Semester</InputLabel>
          <Select
            name="semester"
            value={formData.semester || ""}
            label="Semester"
            onChange={handleChange}
          >
            <MenuItem value="SP25">SP25</MenuItem>
            <MenuItem value="FA24">FA25</MenuItem>
            <MenuItem value="SU25">SU25</MenuItem>
          </Select>
        </FormControl>
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
