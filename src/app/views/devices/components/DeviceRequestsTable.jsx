import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Stack
} from "@mui/material";

const DeviceRequestsTable = ({ data, onApprove, onReject }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleChangePage = (_, newPage) => setPage(newPage);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>OS Version</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>App Version</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((device, index) => (
                <TableRow key={index}>
                  <TableCell>{device.userId}</TableCell>
                  <TableCell>{device.deviceName}</TableCell>
                  <TableCell>{device.platform}</TableCell>
                  <TableCell>{device.osVersion}</TableCell>
                  <TableCell>{device.model}</TableCell>
                  <TableCell>{device.appVersion}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => onApprove(index)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onReject(index)}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />
    </Paper>
  );
};

export default DeviceRequestsTable;
