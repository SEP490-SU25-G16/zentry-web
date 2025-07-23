import React from "react";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ClassAddButton = ({ onClick }) => {
  return (
    <Box display="flex" justifyContent="flex-end" mb={1}>
      <Button onClick={onClick} startIcon={<AddIcon />} variant="contained" color="primary">
        + Add Class
      </Button>
    </Box>
  );
};

export default ClassAddButton;
