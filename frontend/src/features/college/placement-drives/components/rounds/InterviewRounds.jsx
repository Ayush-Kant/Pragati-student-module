import React, { useState } from "react";
import { Plus } from "lucide-react";
import RoundCard from "./RoundCard";
import { INTERVIEW_ROUNDS } from "../../constants/placementDriveConstants";

const InterviewRounds = ({
  rounds = [],
  onChange,
  isEditable = true,
  darkMode,
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
        <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Interview Rounds / Hiring Process
        </label>
        {isEditable && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${darkMode ? 'text-[#ff6d34] bg-[#ff6d34]/10' : 'text-[#ff7a00] bg-[#fff4ec]'}`}>
            {rounds.length} {rounds.length === 1 ? "Round" : "Rounds"}
          </span>
        )}
      </div>

      {/* Rounds list */}
      {rounds.length === 0 ? (
        <div className={`text-center py-6 border border-dashed rounded-xl ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-200 bg-gray-50/50'}`}>
          <p className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No rounds defined. Add a round below to set up the selection process.</p>
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
              darkMode={darkMode}
            />
          ))}
        </div>
      )}

      {/* Add round form */}
      {isEditable && (
        <div className={`p-4 border rounded-xl space-y-3 ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-150 bg-gray-50/50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Add New Round
            </span>
            <button
              type="button"
              onClick={() => {
                setCustomRound(!customRound);
                setNewRoundName("");
              }}
              className={`text-xs font-semibold ${darkMode ? 'text-[#ff6d34] hover:underline' : 'text-[#ff7a00] hover:underline'}`}
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
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none ${
                    darkMode
                      ? 'border-[#3D3D3D] bg-[#1A1A1A] text-white placeholder-gray-500 focus:border-[#ff6d34] focus:ring-1 focus:ring-[#ff6d34]'
                      : 'border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]'
                  }`}
                />
              ) : (
                <select
                  value={newRoundName}
                  onChange={(e) => setNewRoundName(e.target.value)}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm outline-none ${
                    darkMode
                      ? 'border-[#3D3D3D] bg-[#1A1A1A] text-white focus:border-[#ff6d34] focus:ring-1 focus:ring-[#ff6d34]'
                      : 'border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]'
                  }`}
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
                  : darkMode
                    ? "bg-[#3D3D3D] text-gray-500 cursor-not-allowed"
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
