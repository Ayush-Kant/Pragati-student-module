function CollegeStatsCard({title,value}) {
    return (
        <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition" >
            <p className="text-gray-500 text-sm mb-2"> {title} </p>
            <h2 className="text-2xl font-bold">{value}</h2>
        </div>
    )
}

export default CollegeStatsCard;