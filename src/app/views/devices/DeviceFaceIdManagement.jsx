import React, { useState } from "react";
import { Box, Typography, Tab, Tabs, Paper } from "@mui/material";
import DeviceCurrentTable from "./components/DeviceCurrentTable";
import DeviceRequestsTable from "./components/DeviceRequestsTable";
import FaceIdCurrentTable from "./components/FaceIdCurrentTable";
import FaceIdRequestsTable from "./components/FaceIdRequestsTable";

import { mockDeviceCurrent } from "./mock/mockDeviceCurrent";
import { mockDeviceRequests } from "./mock/mockDeviceRequests";
import { mockFaceIdCurrent } from "../faceid/mock/mockFaceIdCurrent";
import { mockFaceIdRequests } from "../faceid/mock/mockFaceIdRequests";

const DeviceFaceIdManagement = () => {
  const [mainTab, setMainTab] = useState(0); // Devices or FaceIDs
  const [subTab, setSubTab] = useState(0); // Current or Requests

  const [devicesCurrent, setDevicesCurrent] = useState(mockDeviceCurrent);
  const [devicesRequest, setDevicesRequest] = useState(mockDeviceRequests);
  const [faceIdsCurrent, setFaceIdsCurrent] = useState(mockFaceIdCurrent);
  const [faceIdsRequest, setFaceIdsRequest] = useState(mockFaceIdRequests);

  const handleMainTabChange = (_, newValue) => {
    setMainTab(newValue);
    setSubTab(0); // reset subTab when switching section
  };

  const handleSubTabChange = (_, newValue) => {
    setSubTab(newValue);
  };

  const handleApproveDevice = (index) => {
    const approved = devicesRequest[index];
    setDevicesCurrent((prev) => [...prev, { ...approved, status: "Approved" }]);
    setDevicesRequest((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRejectDevice = (index) => {
    setDevicesRequest((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApproveFace = (index) => {
    const approved = faceIdsRequest[index];
    setFaceIdsCurrent((prev) => [...prev, approved]);
    setFaceIdsRequest((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRejectFace = (index) => {
    setFaceIdsRequest((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box m={3}>
      <Typography variant="h4" gutterBottom>
        Device & FaceID Management
      </Typography>

      <Paper>
        <Tabs
          value={mainTab}
          onChange={handleMainTabChange}
          indicatorColor="primary"
          textColor="primary"
          // centered
        >
          <Tab label="Devices" />
          <Tab label="Face IDs" />
        </Tabs>

        <Box p={2}>
          <Tabs
            value={subTab}
            onChange={handleSubTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            centered
          >
            <Tab label="Current" />
            <Tab label="Requests" />
          </Tabs>

          <Box mt={2}>
            {mainTab === 0 && subTab === 0 && <DeviceCurrentTable data={devicesCurrent} />}
            {mainTab === 0 && subTab === 1 && (
              <DeviceRequestsTable
                data={devicesRequest}
                onApprove={handleApproveDevice}
                onReject={handleRejectDevice}
              />
            )}
            {mainTab === 1 && subTab === 0 && <FaceIdCurrentTable data={faceIdsCurrent} />}
            {mainTab === 1 && subTab === 1 && (
              <FaceIdRequestsTable
                data={faceIdsRequest}
                onApprove={handleApproveFace}
                onReject={handleRejectFace}
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeviceFaceIdManagement;
