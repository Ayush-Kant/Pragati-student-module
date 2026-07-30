import React from 'react';
import { TASK_STATUS } from '../../constants/projectConstants';
import { getTaskStatusBadgeColor, formatStatusLabel } from '../../utils/projectHelpers';

export const TaskStatusBadge = ({ status }) => {
  return (
    <span
      className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md border ${getTaskStatusBadgeColor(
        status
      )}`}
    >
      {formatStatusLabel(status)}
    </span>
  );
};

export default TaskStatusBadge;
