import React, { useState } from "react";
import { Plus } from "lucide-react";
import RoundCard from "./RoundCard";
import { INTERVIEW_ROUNDS } from "../../constants/placementDriveConstants";

const InterviewRounds = ({
  rounds = [],
  onChange,
  isEditable = true,
}) => {
  const [newRoundName, setNewRoundName] = useState("");
  const [customRound, setCustomRound] = useState(false);

  const handleAddRound = () => {
    if (!newRoundName.trim()) return;

    const newRound = {
      id: Date.now(),
      name: newRoundName.trim(),
      status: "Pending",
    };

    onChange([...rounds, newRound]);
    setNewRoundName("");
  };

  const handleUpdateStatus = (index, status) => {
    const updated = rounds.map((r, i) =>
      i === index ? { ...r, status } : r
    );
    onChange(updated);
  };

  const handleDeleteRound = (index) => {
    const updated = rounds.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-gray-700">
          Interview Rounds / Hiring Process
        </label>
        {isEditable && (
          <span className="text-xs font-semibold text-[#ff7a00] bg-[#fff4ec] px-2.5 py-1 rounded-full">
            {rounds.length} {rounds.length === 1 ? "Round" : "Rounds"}
          </span>
        )}
      </div>

      {/* Rounds list */}
      {rounds.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-xs text-gray-400 font-medium">No rounds defined. Add a round below to set up the selection process.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {rounds.map((round, idx) => (
            <RoundCard
              key={round.id || idx}
              round={round}
              index={idx}
              isEditable={isEditable}
              onUpdateStatus={(status) => handleUpdateStatus(idx, status)}
              onDelete={() => handleDeleteRound(idx)}
            />
          ))}
        </div>
      )}

      {/* Add round form */}
      {isEditable && (
        <div className="p-4 border border-gray-150 rounded-xl bg-gray-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Add New Round
            </span>
            <button
              type="button"
              onClick={() => {
                setCustomRound(!customRound);
                setNewRoundName("");
              }}
              className="text-xs font-semibold text-[#ff7a00] hover:underline"
            >
              {customRound ? "Select standard round" : "Enter custom round name"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              {customRound ? (
                <input
                  type="text"
                  placeholder="e.g. System Design Round"
                  value={newRoundName}
                  onChange={(e) => setNewRoundName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]"
                />
              ) : (
                <select
                  value={newRoundName}
                  onChange={(e) => setNewRoundName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none bg-white focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]"
                >
                  <option value="">-- Choose round --</option>
                  {INTERVIEW_ROUNDS.filter(
                    (round) => !rounds.some((r) => r.name === round)
                  ).map((round) => (
                    <option key={round} value={round}>
                      {round}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddRound}
              disabled={!newRoundName}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                newRoundName
                  ? "bg-[#ff7a00] text-white shadow-sm hover:bg-[#e06b00]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewRounds;
