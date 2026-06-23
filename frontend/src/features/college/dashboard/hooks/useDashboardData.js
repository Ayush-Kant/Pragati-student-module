import { useState, useEffect } from 'react';

export default function useDashboardData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData({});
  }, []);

  return { data };
}
