import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from "@mui/material";
import { mockClassDetails } from "../mock/mockClassDetails";

const ClassDetailPage = () => {
  const { id } = useParams();
  const classDetail = mockClassDetails.find((cls) => cls.id === id);

  const navigate = useNavigate();

  if (!classDetail) return <Typography>Class not found</Typography>;

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom>
        Class Detail
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Students</Typography>
        <List>
          {classDetail.students.map((s, i) => (
            <ListItem key={i}>
              <ListItemText primary={s.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Sessions</Typography>
        <List>
          {classDetail.sessions.map((s) => (
            <ListItem
              key={s.id}
              secondaryAction={
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/schedules/class/${id}/session/${s.id}`)}
                >
                  View
                </Button>
              }
            >
              <ListItemText primary={`Session ${s.id} - ${s.date}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ClassDetailPage;
