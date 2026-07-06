// import { useState, useEffect } from 'react';

// export default function useDashboardData() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     setData({});
//   }, []);

//   return { data };
// }
   import { useEffect, useState } from "react";

export default function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setDashboardStats([]);
    setIsLoading(false);
  }, []);

  return {
    dashboardStats,
    isLoading,
  };
}