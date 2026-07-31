import SectionHeader from "../common/SectionHeader";
import EmptyState from "../common/EmptyState";
import RecordingCard from "./RecordingCard";

export default function RecordingList({ recordings, onPlay, onDownload, isDownloading }) {
  return (
    <section>
      <SectionHeader
        title="Session Recordings"
        subtitle={`${recordings.length} recording${recordings.length === 1 ? "" : "s"} available`}
      />
      {recordings.length === 0 ? (
        <EmptyState
          title="No recordings yet"
          description="Recordings appear here once a live session has been completed and processed."
          icon="🎬"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recordings.map((session) => (
            <RecordingCard
              key={session.id}
              session={session}
              onPlay={onPlay}
              onDownload={onDownload}
              isDownloading={isDownloading?.(session.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
