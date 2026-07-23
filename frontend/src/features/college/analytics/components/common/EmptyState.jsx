import { Inbox } from "lucide-react";

export const EmptyState = ({ message = "No data available", darkMode = false }) => (
  <div className={`flex flex-col items-center justify-center py-10 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
    <Inbox className="w-10 h-10 mb-3 opacity-40" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);
