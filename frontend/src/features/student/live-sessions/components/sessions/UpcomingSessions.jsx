import SectionHeader from "../common/SectionHeader";
import EmptyState from "../common/EmptyState";
import SessionCard from "./SessionCard";

export default function UpcomingSessions({ sessions, onViewDetails, onJoin, isJoining }) {
  return (
    <section>
      <SectionHeader
        title="Upcoming Sessions"
        subtitle={`${sessions.length} session${sessions.length === 1 ? "" : "s"} scheduled`}
      />
      {sessions.length === 0 ? (
        <EmptyState
          title="No upcoming sessions"
          description="New live sessions will show up here as soon as they're scheduled."
          icon="🗓️"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onViewDetails={onViewDetails}
              onJoin={onJoin}
              isJoining={isJoining?.(session.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
