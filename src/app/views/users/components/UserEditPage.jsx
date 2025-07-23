import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import UserForm from "../components/UserForm";
import { mockUsers } from "../mock/mockUsers";

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find((u) => u.UserId.toString() === id);

  const handleSubmit = (updatedUser) => {
    console.log("Saving user", updatedUser);
    navigate("/users");
  };

  return (
    <Box m={3}>
      <UserForm user={user} onSubmit={handleSubmit} />
    </Box>
  );
};

export default UserEditPage;
