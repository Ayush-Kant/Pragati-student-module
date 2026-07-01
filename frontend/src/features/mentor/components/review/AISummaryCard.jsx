import { Sparkles } from "lucide-react";

export default function AISummaryCard() {
  return (
    <div className="mt-6 border rounded-xl p-5 bg-white">

      <div className="flex items-start gap-4">

        <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-violet-600" />
        </div>

        <div className="flex-1">

          <h3 className="font-semibold text-lg">
            AI Analysis Summary
          </h3>

          <p className="text-gray-500 mt-1 leading-6">
            Code structure is generally clean.
            Architecture aligns well with MVC.
            Missing minor validation and
            reusable utility extraction.
          </p>

          <div className="flex gap-3 mt-4">

            <span className="px-3 py-1 rounded-md bg-gray-100 text-sm">
              Strength: Routing
            </span>

            <span className="px-3 py-1 rounded-md bg-gray-100 text-sm">
              Weakness: Error Handling
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}