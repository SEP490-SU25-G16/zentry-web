import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";
import materialRoutes from "app/views/material-kit/MaterialRoutes";
import RoomsPage from "./views/schedules/pages/RoomsPage";
import CoursesPage from "./views/schedules/pages/CoursesPage";
import ClassesPage from "./views/schedules/pages/ClassesPage";
import CurrentDevicesPage from "./views/devices/pages/CurrentDevicesPage";
import RequestsDevicesPage from "./views/devices/pages/RequestsDevicesPage";
import CurrentFaceIdPage from "./views/faceid/pages/CurrentFaceIdPage";
import RequestFaceIdPage from "./views/faceid/pages/RequestFaceIdPage";
import ConfigurationPage from "./views/configuration/pages";

// Existing pages
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));

// New Management Pages
const ScheduleManagement = Loadable(lazy(() => import("app/views/schedules/ScheduleManagement")));

const UserManagement = Loadable(lazy(() => import("app/views/users/UserManagement")));
const DeviceFaceIdManagement = Loadable(
  lazy(() => import("app/views/devices/DeviceFaceIdManagement"))
);
const UserViewPage = Loadable(lazy(() => import("app/views/users/components/UserViewPage")));
const UserEditPage = Loadable(lazy(() => import("app/views/users/components/UserEditPage")));
const ClassDetailPage = Loadable(
  lazy(() => import("app/views/schedules/components/ClassDetailPage"))
);
const SessionDetailPage = Loadable(
  lazy(() => import("app/views/schedules/components/SessionDetailPage"))
);

const routes = [
  { path: "/", element: <Navigate to="dashboard/default" /> },

  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      { path: "/dashboard/default", element: <Analytics />, auth: authRoles.admin },
      { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor },

      // Management Pages
      { path: "/schedules", element: <ScheduleManagement />, auth: authRoles.admin },
      { path: "/users", element: <UserManagement />, auth: authRoles.admin },

      { path: "/devices/current", element: <CurrentDevicesPage />, auth: authRoles.admin },
      { path: "/devices/requests", element: <RequestsDevicesPage />, auth: authRoles.admin },

      { path: "/faceid", element: <CurrentFaceIdPage />, auth: authRoles.admin },

      { path: "/users/view/:id", element: <UserViewPage />, auth: authRoles.admin },
      { path: "/users/edit/:id?", element: <UserEditPage />, auth: authRoles.admin },
      {
        path: "/schedules/class/:classId/session/:sessionId",
        element: <SessionDetailPage />,
        auth: authRoles.admin
      },
      {
        path: "/schedules/rooms",
        element: <RoomsPage />,
        auth: authRoles.admin
      },
      {
        path: "/schedules/courses",
        element: <CoursesPage />,
        auth: authRoles.admin
      },
      {
        path: "/schedules/classes",
        element: <ClassesPage />,
        auth: authRoles.admin
      },
      { path: "/schedules/classes/:id", element: <ClassDetailPage />, auth: authRoles.admin },
      { path: "/configuration", element: <ConfigurationPage />, auth: authRoles.admin }
    ]
  },

  ...sessionRoutes
];

export default routes;
