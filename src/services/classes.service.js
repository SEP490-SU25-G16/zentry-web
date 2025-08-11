import { instance } from "lib/axios";

const ClassServices = {
  createClass: async (classData) => {
    try {
      const { data } = await instance.post("/class-sections", classData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error creating class:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.Error?.Message : "Network Error"
      };
    }
  },
  getClasses: async (params) => {
    try {
      const { data } = await instance.get("/class-sections", {
        params: {
          ...params,
          pageNumber: 1,
          pageSize: 2000
        }
      });
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error fetching classes:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  getClass: async (classId) => {
    try {
      const { data } = await instance.get(`/class-sections/${classId}`);
      return {
        data: data?.Data,
        error: null
      };
    } catch (error) {
      console.error("Error fetching class:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  updateClass: async (classId, classData) => {
    // classData
    //     {
    //   "sectionCode": "SE102",
    //   "semester": "FA25"
    // }
    try {
      const { data } = await instance.put(`/class-sections/${classId}`, classData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error updating class:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  deleteClass: async (classId) => {
    try {
      const { data } = await instance.delete(`/class-sections/${classId}`);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error deleting class:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.Error?.Message : "Network Error"
      };
    }
  },
  enrollStudent: async (classSectionId, studentId) => {
    try {
      const { data } = await instance.post(`/enrollments/enroll-student`, {
        classSectionId,
        studentId
      });
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error enrolling student:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.Error?.Message : "Network Error"
      };
    }
  },
  bulkEnrollStudents: async (classSectionId, studentIds) => {
    try {
      const { data } = await instance.post(`/enrollments/bulk-enroll-students`, {
        classSectionId,
        studentIds
      });
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error bulk enrolling students:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  enrollLecturer: async (classSectionId, lecturerId) => {
    try {
      const { data } = await instance.post(
        `/class-sections/${classSectionId}/lecturers/${lecturerId}`,
        {}
      );
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error enrolling lecturer:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  createSchedule: async (scheduleData) => {
    try {
      const { data } = await instance.post(`/schedules`, {
        ...scheduleData
      });
      console.log(data);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error creating schedule:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.Error?.Message : "Network Error"
      };
    }
  },
  changeAttendance: async (sectionId, studentId, status) => {
    try {
      const { data } = await instance.put(`/attendance/sessions/${sectionId}/students/${studentId}/status`, {
        status
      });
      console.log('run day hehe');
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error changing attendance:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.Error?.Message : "Network Error"
      };
    }
  }
};

export default ClassServices;
