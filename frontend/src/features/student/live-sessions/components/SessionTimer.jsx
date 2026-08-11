import { useEffect, useState } from "react";

const getRemainingTime = (targetTime) => {
  const difference = new Date(targetTime).getTime() - Date.now();

  if (difference <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    total: difference,
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const SessionTimer = ({ startTime, status = "Upcoming" }) => {
  const [remaining, setRemaining] = useState(() =>
    getRemainingTime(startTime)
  );

  useEffect(() => {
    if (!startTime || status === "Completed") return;

    const updateTimer = () => {
      setRemaining(getRemainingTime(startTime));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, status]);

  if (!startTime || status === "Completed") {
    return null;
  }

  if (remaining.total <= 0) {
    return (
      <span className="text-xs font-medium text-green-600">
        Session is starting now
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
      <span>Starts in</span>

      <span className="rounded bg-gray-100 px-2 py-1">
        {remaining.days}d
      </span>

      <span className="rounded bg-gray-100 px-2 py-1">
        {String(remaining.hours).padStart(2, "0")}h
      </span>

      <span className="rounded bg-gray-100 px-2 py-1">
        {String(remaining.minutes).padStart(2, "0")}m
      </span>

      <span className="rounded bg-gray-100 px-2 py-1">
        {String(remaining.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
};

export default SessionTimer;