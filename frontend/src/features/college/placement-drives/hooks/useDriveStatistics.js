import { useMemo } from "react";

const useDriveStatistics = (drives = []) => {
  const statistics = useMemo(() => {
    return {
      totalDrives: drives.length,

      upcomingDrives: drives.filter(
        (drive) => drive.status === "Upcoming"
      ).length,

      openDrives: drives.filter(
        (drive) => drive.status === "Open"
      ).length,

      completedDrives: drives.filter(
        (drive) => drive.status === "Completed"
      ).length,

      cancelledDrives: drives.filter(
        (drive) => drive.status === "Cancelled"
      ).length,
    };
  }, [drives]);

  return statistics;
};

export default useDriveStatistics;