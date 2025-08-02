import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import ClassServices from "services/classes.service";

const useClasses = () => {
  const { enqueueSnackbar } = useSnackbar();

  // State management
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize data
  useEffect(() => {
    fetchClasses();
  }, []);

  // API calls
  const fetchClasses = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ClassServices.getClasses();
      console.log(result);

      if (result.error) {
        setError(result.error);
        enqueueSnackbar(result.error, { variant: "error" });
        setClasses([]);
      } else {
        // Transform API response to match component expectations
        const rawClasses = result.data?.Data?.Items || result.data?.Data || [];
        const transformedClasses = rawClasses.map((cls) => ({
          id: cls.Id,
          courseId: cls.CourseId,
          lecturerId: cls.LecturerId,
          sectionCode: cls.SectionCode,
          semester: cls.Semester,
          courseName: cls.CourseName || `${cls.CourseCode}`,
          lecturerName: cls.LecturerFullName,
          numberOfStudents: cls.NumberOfStudents || 0,
          // Keep original fields for reference
          original: cls
        }));
        setClasses(transformedClasses);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError("Failed to fetch classes");
      enqueueSnackbar("Failed to fetch classes", { variant: "error" });
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (classData) => {
    setSubmitting(true);
    try {
      const result = await ClassServices.createClass(classData);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        enqueueSnackbar("Class created successfully", { variant: "success" });
        refreshClasses();
        return { success: true, data: null };
      }
    } catch (error) {
      console.error("Error creating class:", error);
      const errorMessage = "Failed to create class";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const getClass = async (classId) => {
    try {
      const result = await ClassServices.getClass(classId);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        // Transform the class data to match component expectations
        const transformedClass = {
          id: result.data.Id,
          courseId: result.data.CourseId,
          lecturerId: result.data.LecturerId,
          sectionCode: result.data.SectionCode,
          semester: result.data.Semester,
          courseName: result.data.CourseName || `${result.data.CourseCode}`,
          lecturerName: result.data.LecturerFullName,
          numberOfStudents: result.data.NumberOfStudents || 0,
          original: result.data
        };

        return { success: true, data: transformedClass };
      }
    } catch (error) {
      console.error("Error fetching class:", error);
      const errorMessage = "Failed to fetch class details";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return { success: false, error: errorMessage };
    }
  };

  const updateClass = async (classId, classData) => {
    setSubmitting(true);
    try {
      // API expects only sectionCode and semester for updates
      const updateData = {
        sectionCode: classData.sectionCode,
        semester: classData.semester
      };

      const result = await ClassServices.updateClass(classId, updateData);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        enqueueSnackbar("Class updated successfully", { variant: "success" });

        // Update the class in local state
        setClasses((prev) =>
          prev.map((cls) =>
            cls.id === classId
              ? {
                  ...cls,
                  sectionCode: updateData.sectionCode,
                  semester: updateData.semester
                }
              : cls
          )
        );

        return { success: true, data: result.data };
      }
    } catch (error) {
      console.error("Error updating class:", error);
      const errorMessage = "Failed to update class";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const deleteClass = async (classId) => {
    setSubmitting(true);
    try {
      const result = await ClassServices.deleteClass(classId);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        enqueueSnackbar("Class deleted successfully", { variant: "success" });

        // Remove the class from local state
        setClasses((prev) => prev.filter((cls) => cls.id !== classId));

        return { success: true, data: result.data };
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      const errorMessage = "Failed to delete class";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const enrollStudent = async (classSectionId, studentId) => {
    setSubmitting(true);
    try {
      const result = await ClassServices.enrollStudent(classSectionId, studentId);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        enqueueSnackbar("Student enrolled successfully", { variant: "success" });
        return { success: true, data: result.data };
      }
    } catch (error) {
      console.error("Error enrolling student:", error);
      const errorMessage = "Failed to enroll student";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const bulkEnrollStudents = async (classSectionId, studentIds) => {
    setSubmitting(true);
    try {
      const result = await ClassServices.bulkEnrollStudents(classSectionId, studentIds);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        const studentCount = studentIds.length;
        enqueueSnackbar(
          `${studentCount} student${studentCount > 1 ? "s" : ""} enrolled successfully`,
          { variant: "success" }
        );
        return { success: true, data: result.data };
      }
    } catch (error) {
      console.error("Error bulk enrolling students:", error);
      const errorMessage = "Failed to enroll students";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const createSchedule = async (scheduleData) => {
    setSubmitting(true);
    try {
      const result = await ClassServices.createSchedule(scheduleData);

      if (result.error) {
        enqueueSnackbar(result.error, { variant: "error" });
        return { success: false, error: result.error };
      } else {
        enqueueSnackbar("Schedule created successfully", { variant: "success" });
        return { success: true, data: result.data };
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      const errorMessage = "Failed to create schedule";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const refreshClasses = () => {
    fetchClasses();
  };

  return {
    classes,
    loading,
    submitting,
    error,
    createClass,
    getClass,
    updateClass,
    deleteClass,
    enrollStudent,
    bulkEnrollStudents,
    createSchedule,
    refreshClasses,
    fetchClasses
  };
};

export default useClasses;
