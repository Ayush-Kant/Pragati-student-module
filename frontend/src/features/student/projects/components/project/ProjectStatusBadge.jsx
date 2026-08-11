import React from "react";
import { getProjectStatusStyle } from "../../utils/projectHelpers";

export const ProjectStatusBadge = ({ status, size = "md" }) => {
  const style = getProjectStatusStyle(status);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border ${style.bgClass} ${style.textClass} ${style.borderClass} ${sizeClasses[size]} transition-all`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dotClass} animate-pulse`} />
      <span>{style.label}</span>
    </span>
  );
};

export default ProjectStatusBadge;
