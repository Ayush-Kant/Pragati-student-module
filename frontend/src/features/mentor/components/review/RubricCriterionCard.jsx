export default function RubricCriterionCard({
    title,
    description,
    score
}) {
    return (
        <div className="border rounded-xl p-4 bg-white">

            <div className="flex justify-between">

                <div>

                    <h3 className="font-semibold text-gray-800">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        {description}
                    </p>

                </div>

                <input
                    type="number"
                    defaultValue={score}
                    className="w-16 h-10 border rounded-lg text-center"
                />

            </div>

            <textarea
                rows={3}
                placeholder="Add specific feedback..."
                className="mt-4 w-full border rounded-lg p-3 resize-none"
            />

        </div>
    );
}