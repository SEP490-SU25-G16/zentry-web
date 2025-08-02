import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import CourseServices from "services/courses.service";

const PAGE_SIZE = 5;

const useCourses = () => {
  const { enqueueSnackbar } = useSnackbar();

  // State management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("Code");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Initialize data
  useEffect(() => {
    fetchCourses();
  }, []);

  // API calls
  const fetchCourses = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    try {
      const result = await CourseServices.getCourses();

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        setCourses([]);
        setTotalCount(0);
      } else {
        setCourses(result.data?.Data?.Items || []);
        setTotalCount(result.data?.Data?.TotalCount || 0);
      }
    } catch (error) {
      console.error("Error in fetchCourses:", error);
      enqueueSnackbar("Failed to fetch courses", { variant: "error" });
      setCourses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search handler
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Sorting handlers
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0); // Reset to first page when sorting
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

  // Data processing functions
  const getSortedAndFilteredCourses = () => {
    const filteredCourses = courses.filter(
      (course) =>
        course.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.Description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredCourses.sort((a, b) => {
      const result = compareValues(a, b, orderBy);
      return order === "desc" ? -result : result;
    });
  };

  const getPaginatedCourses = () => {
    const sortedAndFilteredCourses = getSortedAndFilteredCourses();
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedAndFilteredCourses.slice(startIndex, endIndex);
  };

  const getFilteredCount = () => {
    return getSortedAndFilteredCourses().length;
  };

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Modal handlers
  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingCourseId(null);
    setFormData({
      code: "",
      name: "",
      description: ""
    });
    setFormErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      code: "",
      name: "",
      description: ""
    });
    setFormErrors({});
    setIsEditMode(false);
    setEditingCourseId(null);
  };

  // Form handlers
  const handleFormChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: ""
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.code.trim()) {
      errors.code = "Course code is required";
    }

    if (!formData.name.trim()) {
      errors.name = "Course name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Course description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const courseData = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim()
      };

      let result;
      if (isEditMode) {
        result = await CourseServices.editCourse(editingCourseId, courseData);
      } else {
        result = await CourseServices.addCourse(courseData);
      }

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
      } else {
        enqueueSnackbar(`Course ${isEditMode ? "updated" : "added"} successfully`, {
          variant: "success"
        });
        handleCloseModal();
        fetchCourses();
      }
    } catch (error) {
      console.error("Error submitting course:", error);
      enqueueSnackbar(`Failed to ${isEditMode ? "update" : "add"} course`, {
        variant: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Edit handler
  const handleEdit = (course) => {
    setIsEditMode(true);
    setEditingCourseId(course.Id);
    setFormData({
      code: course.Code || "",
      name: course.Name || "",
      description: course.Description || ""
    });
    setOpenModal(true);
  };

  // Delete handlers
  const handleDelete = async (courseId) => {
    const course = courses.find((c) => c.Id === courseId);
    setCourseToDelete(course);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    setSubmitting(true);
    try {
      const result = await CourseServices.deleteCourse(courseToDelete.Id);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
      } else {
        enqueueSnackbar("Course deleted successfully", { variant: "success" });
        fetchCourses();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      enqueueSnackbar("Failed to delete course", { variant: "error" });
    } finally {
      setSubmitting(false);
      setConfirmDeleteOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setCourseToDelete(null);
  };

  return {
    // State
    courses,
    loading,
    submitting,
    page,
    rowsPerPage,
    order,
    orderBy,
    searchTerm,
    totalCount,
    openModal,
    isEditMode,
    editingCourseId,
    formData,
    formErrors,
    confirmDeleteOpen,
    courseToDelete,

    // Computed values
    paginatedCourses: getPaginatedCourses(),
    filteredCount: getFilteredCount(),

    // Handlers
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleRequestSort,
    handleOpenModal,
    handleCloseModal,
    handleFormChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,

    // Utilities
    formatDate,

    // API
    fetchCourses
  };
};

export default useCourses;
