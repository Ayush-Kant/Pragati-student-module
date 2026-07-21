import React, { useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  Calendar,
  Layers,
  MessageSquare,
  Video,
  FileText,
  BarChart3,
  Award,
  Loader2
} from "lucide-react";
import DrawerLearningProgress from "./DrawerLearningProgress";
import DrawerPerformanceStats from "./DrawerPerformanceStats";

export default function StudentProfileDrawer({
  isOpen = false,
  onClose,
  profile = null,
  loading = false,
  notes = "",
  setNotes,
  savingNotes = false,
  onSaveNotes,
  studentAttendance = "0%"
}) {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper to generate initials
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Semi-transparent backdrop with blur effect */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Slide-out drawer body */}
      <div className="relative z-10 flex h-full w-full max-w-[540px] flex-col bg-slate-50 shadow-2xl transition-transform duration-300 ease-out animate-slide-in">
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#004ac6]" />
              <span className="text-sm font-bold text-slate-500">Loading student profile...</span>
            </div>
          </div>
        )}

        {/* Drawer Header */}
        {profile && (
          <div className="shrink-0 border-b border-slate-200 bg-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              {/* Profile Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100 text-lg font-bold text-sky-700">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  getInitials(profile.name)
                )}
              </div>

              {/* Student info */}
              <div>
                <h3 className="text-lg font-black text-slate-800">{profile.name}</h3>
                <p className="text-sm font-bold text-sky-600 mt-0.5">{profile.role}</p>

                <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {profile.joinDate || "Joined recent"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    {profile.batch || "No Batch"}
                  </span>
                </div>
              </div>
            </div>

            {/* Email and Phone Contact Row */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2.5 rounded-xl border border-slate-150 bg-slate-50/50 p-3 text-xs font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
                  <Mail className="h-4 w-4 text-[#004ac6]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</div>
                  <div className="truncate mt-0.5">{profile.email}</div>
                </div>
              </a>

              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-2.5 rounded-xl border border-slate-150 bg-slate-50/50 p-3 text-xs font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
                  <Phone className="h-4 w-4 text-[#004ac6]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</div>
                  <div className="mt-0.5">{profile.phone}</div>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 [scrollbar-width:thin]">
          {profile && (
            <>
              {/* Learning Progress Section */}
              <DrawerLearningProgress
                overallProgress={profile.overallProgress}
                topics={profile.learningProgress}
              />

              {/* Performance Section */}
              <DrawerPerformanceStats
                performance={profile.performance}
                attendance={studentAttendance}
              />

              {/* Recent Activity Timeline */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4.5">Recent Activity</h4>
                
                <div className="relative border-l border-slate-200 pl-4.5 ml-2 space-y-5">
                  {profile.recentActivity?.map((act, index) => (
                    <div key={index} className="relative">
                      {/* Bullet Dot */}
                      <span className="absolute -left-[24.5px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#004ac6] ring-4 ring-blue-50" />
                      
                      <div>
                        <p className="text-sm font-bold text-slate-700">{act.action}</p>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 block uppercase tracking-wider">
                          {act.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!profile.recentActivity || profile.recentActivity.length === 0) && (
                    <p className="text-xs text-slate-400">No recent activity logged.</p>
                  )}
                </div>
              </div>

              {/* Mentor Notes Area */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="text-sm font-bold text-slate-800">Mentor Notes</h4>
                  <button
                    onClick={onSaveNotes}
                    disabled={savingNotes}
                    className="rounded-lg bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-[#004ac6] border border-sky-100 hover:bg-[#004ac6] hover:text-white hover:border-[#004ac6] disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {savingNotes && <Loader2 className="h-3 w-3 animate-spin" />}
                    Save Notes
                  </button>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record student strengths, areas of improvement, or custom notes..."
                  className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-medium text-slate-700 outline-none transition-all focus:bg-white focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] placeholder-slate-400"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {profile && (
          <div className="shrink-0 border-t border-slate-200 bg-white p-5.5 space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-0.5">Quick Actions</h5>
            
            {/* Action buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#004ac6] py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer">
                <MessageSquare className="h-4 w-4" />
                Message
              </button>
              
              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                <Video className="h-4 w-4 text-slate-400" />
                Book Session
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                <FileText className="h-4 w-4 text-slate-400" />
                View Assignments
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                <BarChart3 className="h-4 w-4 text-slate-400" />
                Progress Report
              </button>
            </div>

            {/* Prominent Issue Certificate Button */}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-teal-900 cursor-pointer">
              <Award className="h-4.5 w-4.5" />
              Issue Certificate
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
