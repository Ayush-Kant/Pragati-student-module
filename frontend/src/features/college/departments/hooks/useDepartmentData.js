import { useEffect, useMemo, useState } from "react";

import {
  getDepartments,
  getCourses,
} from "../services/departmentService";

import {
  searchDepartments,
  filterDepartments,
} from "../utils/departmentHelpers";

export const useDepartmentData = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const departmentData = await getDepartments();

      const courseData = await getCourses();

      setDepartments(departmentData);

      setCourses(courseData);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = useMemo(() => {
    const searched = searchDepartments(departments, search);

    return filterDepartments(searched, filter);
  }, [departments, search, filter]);

  return {
    departments: filteredDepartments,
    courses,

    loading,

    search,
    setSearch,

    filter,
    setFilter,

    reload: loadData,
  };
};