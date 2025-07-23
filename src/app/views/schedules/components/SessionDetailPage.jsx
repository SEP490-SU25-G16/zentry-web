import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Chip, List, ListItem, ListItemText } from "@mui/material";
import { mockSessionDetails } from "../mock/mockSessionDetails";

const SessionDetailPage = () => {
  const { sessionId } = useParams();
  const session = mockSessionDetails[sessionId];

  if (!session) return <Typography>Session not found</Typography>;

  return (
    <Box m={3}>
      <Typography variant="h4">Session Detail</Typography>
      <Typography variant="subtitle1">Date: {session.date}</Typography>
      <Typography variant="subtitle1">Topic: {session.topic}</Typography>

      <Box mt={3}>
        <Typography variant="h6">Student Attendance</Typography>
        <List>
          {session.attendance.map((s, i) => (
            <ListItem key={i}>
              <ListItemText primary={s.name} />
              <Chip
                label={s.status}
                color={
                  s.status === "attended"
                    ? "success"
                    : s.status === "absented"
                    ? "error"
                    : "default"
                }
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SessionDetailPage;
