import { useOutletContext } from "react-router-dom";
import { statusStyles } from '../../constants/studentNominationConstants'

const StatusBadge = ({ status }) => {
  const { darkMode } = useOutletContext();

  const { badge } = statusStyles[status] || statusStyles.Eligible;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors min-w-22
      ${darkMode ? badge.dark : badge.light}
    `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
