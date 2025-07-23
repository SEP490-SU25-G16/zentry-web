import React from "react";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const RoomAddButton = ({ onClick }) => (
  <Box textAlign="right" mb={2}>
    <Button variant="contained" startIcon={<AddIcon />} onClick={onClick}>
      Add Room
    </Button>
  </Box>
);

export default RoomAddButton;
