import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import UserServices from "services/user.service";

const PAGE_SIZE = 5;

export const useUsers = () => {
  const { enqueueSnackbar } = useSnackbar();

  // States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("CreatedAt");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await UserServices.getUsers();
      console.log(result?.data?.Data?.Users || []);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        setUsers([]);
        setTotalCount(0);
      } else {
        setUsers(result?.data?.Data?.Users || []);
        setTotalCount(result?.data?.Data?.TotalCount || 0);

        // Extract unique statuses and roles from the data
        const users = result.data?.Data?.Users || [];
        const statuses = [...new Set(users?.map((user) => user.Status).filter(Boolean))];
        const roles = [...new Set(users?.map((user) => user.Role).filter(Boolean))];

        setAvailableStatuses(statuses);
        setAvailableRoles(roles);
      }
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      enqueueSnackbar("Failed to fetch users", { variant: "error" });
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setRoleFilter("");
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0);
  };

  const compareValues = (a, b, orderBy) => {
    let valueA = a[orderBy];
    let valueB = b[orderBy];

    if (orderBy === "CreatedAt") {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  };

  const getSortedAndFilteredUsers = () => {
    const filteredUsers = users.filter((user) => {
      const matchesSearch =
        user.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Status?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || user.Status === statusFilter;
      const matchesRole = !roleFilter || user.Role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });

    return filteredUsers.sort((a, b) => {
      const result = compareValues(a, b, orderBy);
      return order === "desc" ? -result : result;
    });
  };

  const getPaginatedUsers = () => {
    const sortedAndFilteredUsers = getSortedAndFilteredUsers();
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedAndFilteredUsers.slice(startIndex, endIndex);
  };

  const getFilteredCount = () => {
    return getSortedAndFilteredUsers().length;
  };

  const createUser = async (userData) => {
    setSubmitting(true);
    try {
      const result = await UserServices.createUser(userData);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        enqueueSnackbar("User created successfully", { variant: "success" });
        await fetchUsers();
        return { success: true };
      }
    } catch (error) {
      console.error("Error creating user:", error);
      enqueueSnackbar("Failed to create user", { variant: "error" });
      return { success: false, error: "Failed to create user" };
    } finally {
      setSubmitting(false);
    }
  };

  const updateUser = async (userId, userData) => {
    setSubmitting(true);
    try {
      const result = await UserServices.updateUser(userId, userData);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        enqueueSnackbar("User updated successfully", { variant: "success" });
        await fetchUsers();
        return { success: true };
      }
    } catch (error) {
      console.error("Error updating user:", error);
      enqueueSnackbar("Failed to update user", { variant: "error" });
      return { success: false, error: "Failed to update user" };
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (userId) => {
    setSubmitting(true);
    try {
      const result = await UserServices.deleteUser(userId);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        enqueueSnackbar("User deleted successfully", { variant: "success" });
        await fetchUsers();
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      enqueueSnackbar("Failed to delete user", { variant: "error" });
      return { success: false, error: "Failed to delete user" };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // State
    users,
    loading,
    submitting,
    page,
    rowsPerPage,
    order,
    orderBy,
    searchTerm,
    statusFilter,
    roleFilter,
    availableStatuses,
    availableRoles,
    totalCount,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,

    // Handlers
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleStatusFilterChange,
    handleRoleFilterChange,
    handleResetFilters,
    handleRequestSort,

    // Computed values
    getSortedAndFilteredUsers,
    getPaginatedUsers,
    getFilteredCount
  };
};
