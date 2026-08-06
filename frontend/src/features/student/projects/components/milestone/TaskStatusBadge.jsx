import React from "react";
import { getTaskStatusStyle } from "../../utils/projectHelpers";

export const TaskStatusBadge = ({ status }) => {
  const style = getTaskStatusStyle(status);

  return (
    <span
      className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${style.badgeBg} transition-all`}
    >
      {style.label}
    </span>
  );
};

export default TaskStatusBadge;
