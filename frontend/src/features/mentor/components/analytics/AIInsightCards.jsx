export default function AIInsightCards({ data }) {
  const insights = data;

  const colors = {
    red: "border-red-500",
    purple: "border-purple-500",
    teal: "border-teal-500",
  };

  return (
    <div className="bg-white border rounded-xl p-6 h-full">

      <h2 className="font-semibold text-lg mb-6">
        Rubric Insights
      </h2>

      <div className="space-y-5">

        {insights.map((item) => (

          <div
            key={item.title}
            className={`border-l-4 ${colors[item.color]} pl-4`}
          >

            <h3 className="font-semibold text-sm">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-gray-500 leading-6">
              {item.description}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}