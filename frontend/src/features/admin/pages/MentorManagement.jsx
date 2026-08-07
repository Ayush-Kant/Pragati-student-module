import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Modal from "react-modal";
import useMentorManagement from "../hooks/useMentorManagement";
import MentorTable from "../components/MentorTable";
Modal.setAppElement("#root");
export default function MentorManagement() {
  const { darkMode } = useOutletContext();

  const {
    loading,
    filteredMentors,
    currentMentors,

    currentPage,
    setCurrentPage,
    totalPages,

    search,
    setSearch,

    expertise,
    setExpertise,

    status,
    setStatus,

    addMentor,
    removeMentor,
    assignMentor,
    replaceMentor,
    toggleMentorStatus,
  } = useMentorManagement();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expertise: [],
    rating: 0,
    activeBatches: 0,
  });

  const handleAddMentorClick = () => {
    setFormData({
      name: "",
      email: "",
      expertise: [],
      rating: 0,
      activeBatches: 0,
    });
    setIsAddModalOpen(true);
  };

  const handleAddMentorSubmit = async () => {
    if (!formData.name || !formData.email || formData.expertise.length === 0) {
      alert("Please fill all fields");
      return;
    }

    await addMentor({
      name: formData.name,
      email: formData.email,
      expertise: formData.expertise,
      rating: parseFloat(formData.rating),
      activeBatches: parseInt(formData.activeBatches),
    });

    setIsAddModalOpen(false);
    setFormData({
      name: "",
      email: "",
      expertise: [],
      rating: 0,
      activeBatches: 0,
    });
  };

  const handleExpertiseChange = (value) => {
    if (formData.expertise.includes(value)) {
      setFormData({
        ...formData,
        expertise: formData.expertise.filter((e) => e !== value),
      });
    } else {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, value],
      });
    }
  };

  const handleMentorRemove = async (mentorId) => {
    await removeMentor(mentorId);
    setCurrentPage(1);
  };

  const handleMentorAssign = async (mentorId, batchId) => {
    await assignMentor(mentorId, batchId);
  };

  const handleMentorReplace = async (mentorId, newMentorId) => {
    await replaceMentor(mentorId, newMentorId);
  };

  return (
    <div
      className={`min-h-screen w-full px-6 py-6 ${
        darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold truncate">Mentor Management</h1>
            <p
              className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Manage mentors and monitor performance.
            </p>
          </div>

          <button
            onClick={handleAddMentorClick}
            className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 whitespace-nowrap"
          >
            + Add Mentor
          </button>
        </div>

        <div
          className={`p-4 rounded-lg shadow ${
            darkMode
              ? "bg-slate-950 border border-slate-700"
              : "bg-white border border-slate-200"
          } flex flex-col gap-4 md:flex-row md:items-center`}
        >
          <input
            type="text"
            placeholder="Search mentor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full min-w-0 border rounded px-3 py-2 ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-slate-100 border-slate-300 text-slate-900"
            }`}
          />

          <select
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            className={`w-full sm:w-auto border rounded px-3 py-2 ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-slate-100 border-slate-300 text-slate-900"
            }`}
          >
            <option value="all">All Expertise</option>
            <option value="MERN">MERN</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`w-full sm:w-auto border rounded px-3 py-2 ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-slate-100 border-slate-300 text-slate-900"
            }`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <h2 className="font-semibold">
            Showing {filteredMentors.length} mentors
          </h2>
        </div>

        {loading ? (
          <div className="text-sm">Loading...</div>
        ) : (
          <MentorTable
            key={`${search}-${expertise}-${status}-${filteredMentors.length}`}
            mentors={currentMentors}
            darkMode={darkMode}
            onMentorRemove={handleMentorRemove}
            onMentorAssign={handleMentorAssign}
            onMentorReplace={handleMentorReplace}
            onStatusToggle={toggleMentorStatus}
          />
        )}
      </div>

      {/* Pagination */}

      <div className="flex justify-center items-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="border px-4 py-2 rounded"
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="border px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Add Mentor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        ariaHideApp={false}
        className={`
  w-full
  max-w-2xl
  rounded-xl
  p-6
  mx-auto
  mt-10
  outline-none
  max-h-[90vh]
  overflow-y-auto
  ${darkMode ? "bg-slate-950 border border-slate-700" : "bg-white"}
`}
        overlayClassName="
  fixed
  inset-0
  z-50
  bg-black/50
  flex
  justify-center
  items-start
  p-4
  overflow-y-auto
"
      >
        <h2 className="text-xl font-bold mb-4">Add New Mentor</h2>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-slate-300" : "text-slate-900"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full border rounded px-3 py-2 ${
                darkMode
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "border-slate-300 text-slate-900"
              }`}
              placeholder="Mentor name"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-slate-300" : "text-slate-900"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full border rounded px-3 py-2 ${
                darkMode
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "border-slate-300 text-slate-900"
              }`}
              placeholder="mentor@example.com"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-900"
              }`}
            >
              Expertise
            </label>
            <div className="flex flex-wrap gap-2">
              {["MERN", "React", "Node.js", "AI/ML", "Python", "Java"].map(
                (exp) => (
                  <button
                    key={exp}
                    onClick={() => handleExpertiseChange(exp)}
                    className={`px-3 py-1 rounded text-sm transition ${
                      formData.expertise.includes(exp)
                        ? "bg-blue-600 text-white"
                        : darkMode
                          ? "bg-slate-800 border border-slate-700 text-slate-300"
                          : "bg-gray-200 text-slate-900"
                    }`}
                  >
                    {exp}
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-slate-300" : "text-slate-900"
              }`}
            >
              Rating
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              className={`w-full border rounded px-3 py-2 ${
                darkMode
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "border-slate-300 text-slate-900"
              }`}
              placeholder="0"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-slate-300" : "text-slate-900"
              }`}
            >
              Active Batches
            </label>
            <input
              type="number"
              min="0"
              value={formData.activeBatches}
              onChange={(e) =>
                setFormData({ ...formData, activeBatches: e.target.value })
              }
              className={`w-full border rounded px-3 py-2 ${
                darkMode
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "border-slate-300 text-slate-900"
              }`}
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className={`w-full sm:w-auto px-4 py-2 border rounded ${
              darkMode
                ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                : "border-slate-300 text-slate-900 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleAddMentorSubmit}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
