import SectionHeader from "../common/SectionHeader";
import EmptyState from "../common/EmptyState";
import SessionCard from "./SessionCard";

export default function PastSessions({ sessions, onViewDetails }) {
  return (
    <section>
      <SectionHeader
        title="Past Sessions"
        subtitle={`${sessions.length} session${sessions.length === 1 ? "" : "s"} completed`}
      />
      {sessions.length === 0 ? (
        <EmptyState
          title="No past sessions yet"
          description="Completed sessions and their recordings will appear here."
          icon="📼"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </section>
  );
}
