
export default function CollegeStatusButtons({ status }){
    
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    suspended: "bg-gray-200 text-gray-700",
  };

return(
        <div
      className={`px-4 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-2 ${statusStyles[status]}`}
    >
      <span className="w-2 h-2 rounded-full bg-current"></span>
      {status}
    </div>
    )
}