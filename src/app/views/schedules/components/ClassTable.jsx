// src/app/views/schedules/components/ClassTable.jsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Paper,
  Tooltip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const groupBySemester = (data) => {
  return data.reduce((acc, cls) => {
    (acc[cls.semester] = acc[cls.semester] || []).push(cls);
    return acc;
  }, {});
};

const ClassTable = ({ data, onEdit, onDelete }) => {
  const grouped = groupBySemester(data);
  const navigate = useNavigate();

  return (
    <Paper>
      {Object.entries(grouped).map(([semester, classes]) => (
        <Accordion key={semester}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Semester: {semester}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell>Lecturer</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classes.map((cls, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{cls.courseName}</TableCell>
                      <TableCell>{cls.lecturerName}</TableCell>
                      <TableCell>{cls.sectionCode}</TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton onClick={() => navigate(`/schedules/class/${cls.id}`)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => onEdit(cls)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => onDelete(cls)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default ClassTable;
