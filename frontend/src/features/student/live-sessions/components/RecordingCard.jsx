// RecordingCard.jsx
// Displays a session recording if available, or a not-yet-available message

const RecordingCard = ({ recording, loading }) => {
  if (loading) {
    return <p className="text-sm text-gray-400">Loading recording...</p>;
  }

  if (!recording?.available) {
    return (
      <div className="flex items-center gap-3 p-3 border border-dashed border-gray-200 rounded-lg text-sm text-gray-500">
        <span className="text-xl">🎥</span>
        Recording not available yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-black">
      <video controls className="w-full aspect-video">
        <source src={recording.recordingUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default RecordingCard;
