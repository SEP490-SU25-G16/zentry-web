import React from "react";
import { TextField, Button, MenuItem, Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const roles = ["Admin", "Lecture", "Student"];
const statuses = ["Active", "Inactive"];

const UserForm = ({ user, onSubmit }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState(
    user || {
      UserId: Date.now(),
      FullName: "",
      Email: "",
      Role: "Student",
      Status: "Active",
      CreatedAt: new Date().toISOString()
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" mb={2}>
        User Form
      </Typography>
      <TextField
        fullWidth
        label="Full Name"
        name="FullName"
        value={formData.FullName}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="Email"
        value={formData.Email}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        select
        fullWidth
        label="Role"
        name="Role"
        value={formData.Role}
        onChange={handleChange}
        margin="normal"
      >
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        label="Status"
        name="Status"
        value={formData.Status}
        onChange={handleChange}
        margin="normal"
      >
        {statuses.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <Box mt={3}>
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/users")}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </form>
  );
};

export default UserForm;
