import React, { useState } from "react";
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";

import RoomTable from "./components/RoomTable";
import CourseTable from "./components/CourseTable";
import ClassTable from "./components/ClassTable";

import RoomAddButton from "./components/RoomAddButton";
import CourseAddButton from "./components/CourseAddButton";
import ClassAddButton from "./components/ClassAddButton";

import RoomEditDialog from "./components/RoomEditDialog";
import CourseEditDialog from "./components/CourseEditDialog";
import ClassEditDialog from "./components/ClassEditDialog";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";

import { mockRooms } from "./mock/mockRooms";
import { mockCourses } from "./mock/mockCourses";
import { mockClasses } from "./mock/mockClasses";

const ScheduleManagement = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const [rooms, setRooms] = useState(mockRooms);
  const [courses, setCourses] = useState(mockCourses);
  const [classes, setClasses] = useState(mockClasses);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  // ---------- ROOM ----------
  const handleAddRoom = () => setSelectedRoom({ roomName: "", building: "", capacity: "" });
  const handleEditRoom = (room) => setSelectedRoom(room);
  const handleDeleteRoom = (room) => {
    setDeleteTarget(room);
    setDeleteType("room");
  };
  const handleRoomSave = (updated) => {
    if (selectedRoom?.roomName) {
      setRooms((prev) => prev.map((r) => (r.roomName === selectedRoom.roomName ? updated : r)));
    } else {
      setRooms((prev) => [...prev, updated]);
    }
    setSelectedRoom(null);
  };

  // ---------- COURSE ----------
  const handleAddCourse = () =>
    setSelectedCourse({ code: "", name: "", description: "", semester: "" });
  const handleEditCourse = (course) => setSelectedCourse(course);
  const handleDeleteCourse = (course) => {
    setDeleteTarget(course);
    setDeleteType("course");
  };
  const handleCourseSave = (updated) => {
    if (selectedCourse?.code) {
      setCourses((prev) => prev.map((c) => (c.code === selectedCourse.code ? updated : c)));
    } else {
      setCourses((prev) => [...prev, updated]);
    }
    setSelectedCourse(null);
  };

  // ---------- CLASS ----------
  const handleAddClass = () =>
    setSelectedClass({
      id: "",
      courseName: "",
      lecturerName: "",
      sectionCode: "",
      semester: ""
    });
  const handleEditClass = (cls) => setSelectedClass(cls);
  const handleDeleteClass = (cls) => {
    setDeleteTarget(cls);
    setDeleteType("class");
  };
  const handleClassSave = (updated) => {
    if (selectedClass?.id) {
      setClasses((prev) => prev.map((c) => (c.id === selectedClass.id ? updated : c)));
    } else {
      setClasses((prev) => [...prev, updated]);
    }
    setSelectedClass(null);
  };

  const handleConfirmDelete = () => {
    if (deleteType === "room") {
      setRooms((prev) => prev.filter((r) => r.roomName !== deleteTarget.roomName));
    } else if (deleteType === "course") {
      setCourses((prev) => prev.filter((c) => c.code !== deleteTarget.code));
    } else if (deleteType === "class") {
      setClasses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
    setDeleteType("");
  };

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom>
        Schedule Management
      </Typography>
      <Paper>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Rooms" />
          <Tab label="Courses" />
          <Tab label="Classes" />
        </Tabs>
        <Box mt={2} p={2}>
          {tabIndex === 0 && (
            <>
              <RoomAddButton onClick={handleAddRoom} />
              <RoomTable data={rooms} onEdit={handleEditRoom} onDelete={handleDeleteRoom} />
            </>
          )}
          {tabIndex === 1 && (
            <>
              <CourseAddButton onClick={handleAddCourse} />
              <CourseTable data={courses} onEdit={handleEditCourse} onDelete={handleDeleteCourse} />
            </>
          )}
          {tabIndex === 2 && (
            <>
              <ClassAddButton onClick={handleAddClass} />
              <ClassTable data={classes} onEdit={handleEditClass} onDelete={handleDeleteClass} />
            </>
          )}
        </Box>
      </Paper>

      {/* Dialogs */}
      <RoomEditDialog
        open={Boolean(selectedRoom)}
        initialData={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onSave={handleRoomSave}
      />
      <CourseEditDialog
        open={Boolean(selectedCourse)}
        initialData={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onSave={handleCourseSave}
      />
      <ClassEditDialog
        open={Boolean(selectedClass)}
        initialData={selectedClass}
        onClose={() => setSelectedClass(null)}
        onSave={handleClassSave}
      />
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Confirm Delete"
        content={`Are you sure you want to delete this ${deleteType}?`}
        onClose={() => {
          setDeleteTarget(null);
          setDeleteType("");
        }}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default ScheduleManagement;
