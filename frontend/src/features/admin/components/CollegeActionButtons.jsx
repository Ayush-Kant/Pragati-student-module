export default function CollegeActionButtons({ status }) {

  return (
    <div className="flex items-center gap-3">

      {/* Pending */}
      {status === "pending" && (
        <>
          <button className="px-5 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition">
            Approve
          </button>

          <button className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition">
            Reject
          </button>
        </>
      )}

      {/* Approved */}
      {status === "approved" && (
        <button className="px-5 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition">
          Suspend
        </button>
      )}

      {/* Suspended */}
      {status === "suspended" && (
        <button className="px-5 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition">
          Approve
        </button>
      )}

      {/* Rejected */}
      {status === "rejected" && (
        <button className="px-5 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition">
          Approve
        </button>
      )}

    </div>
  );
}