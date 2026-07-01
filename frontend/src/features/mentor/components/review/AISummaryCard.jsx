import { Sparkles } from "lucide-react";

export default function AISummaryCard() {
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">

      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
          <Sparkles
            size={24}
            className="text-violet-600"
          />
        </div>

        <div className="flex-1">

          <h3 className="text-xl font-semibold text-gray-900">
            AI Analysis Summary
          </h3>

          <p className="mt-2 text-gray-600 leading-7">
            Code structure is generally clean.
            Architecture aligns well with MVC.
            Missing minor validation and reusable
            utility extraction.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
              Strength: Routing
            </span>

            <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
              Weakness: Error Handling
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}