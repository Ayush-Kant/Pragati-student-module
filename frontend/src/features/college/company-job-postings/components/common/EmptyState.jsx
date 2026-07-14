import { Inbox } from "lucide-react";

const EmptyState = ({ message = "No Data Found" }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-12 text-center">
      <Inbox
        size={60}
        className="mx-auto text-slate-400 mb-4"
      />

      <h2 className="text-xl font-semibold text-slate-700">
        {message}
      </h2>
    </div>
  );
};

export default EmptyState;