import {
  departmentList,
  courseList,
} from "../types/departmentDummyData";

export const getDepartments = async () => {
  return Promise.resolve([...departmentList]);
};

export const getCourses = async () => {
  return Promise.resolve([...courseList]);
};

/*
Replace later with API calls

export const getDepartments = () => axios.get("/departments");

export const addDepartment = () => axios.post(...);

export const updateDepartment = () => axios.put(...);

export const deleteDepartment = () => axios.delete(...);

*/