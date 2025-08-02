import { instance } from "lib/axios";

const CourseServices = {
  getCourses: async (params) => {
    try {
      const { data } = await instance.get("/courses", {
        params: {
          ...params,
          PageSize: 2000
        }
      });
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error fetching courses:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  addCourse: async (courseData) => {
    try {
      const { data } = await instance.post("/courses", courseData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error adding course:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  editCourse: async (courseId, courseData) => {
    try {
      const { data } = await instance.put(`/courses/${courseId}`, courseData);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error editing course:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  },
  deleteCourse: async (courseId) => {
    try {
      const { data } = await instance.delete(`/courses/${courseId}`);
      return {
        data,
        error: null
      };
    } catch (error) {
      console.error("Error deleting course:", error);
      return {
        data: null,
        error: error.response ? error.response.data?.errors : "Network Error"
      };
    }
  }
};

export default CourseServices;
