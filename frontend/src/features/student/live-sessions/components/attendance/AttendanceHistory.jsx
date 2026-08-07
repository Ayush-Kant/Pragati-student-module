import SectionHeader from "../common/SectionHeader";
import EmptyState from "../common/EmptyState";
import AttendanceCard from "./AttendanceCard";

export default function AttendanceHistory({ history }) {
  return (
    <section>
      <SectionHeader title="Attendance History" subtitle="Your record across all sessions" />
      {!history?.length ? (
        <EmptyState title="No attendance records yet" icon="🗂️" />
      ) : (
        <div className="space-y-2">
          {history.map((record) => (
            <AttendanceCard key={record.sessionId} record={record} />
          ))}
        </div>
      )}
    </section>
  );
}
