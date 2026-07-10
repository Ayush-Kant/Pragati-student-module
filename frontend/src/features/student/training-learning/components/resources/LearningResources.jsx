// LearningResources.jsx
// Lists a course's downloadable materials + notes, and wires up the
// download / notes-viewer modals

import { useState } from "react";
import ResourceCard from "./ResourceCard";
import DownloadMaterial from "./DownloadMaterial";
import NotesViewer from "./NotesViewer";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import { EMPTY_MESSAGES } from "../../constants/trainingLearningConstants";

const LearningResources = ({ resources, loading, error, onRetry }) => {
  const [downloadTarget, setDownloadTarget] = useState(null);
  const [notesTarget, setNotesTarget] = useState(null);

  if (loading) return <LoadingSpinner label="Loading resources..." />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!resources?.length) {
    return <EmptyState title="No resources yet" message={EMPTY_MESSAGES.RESOURCES} icon="📁" />;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onDownload={setDownloadTarget}
            onViewNotes={setNotesTarget}
          />
        ))}
      </div>

      <DownloadMaterial resource={downloadTarget} onClose={() => setDownloadTarget(null)} />
      <NotesViewer resource={notesTarget} onClose={() => setNotesTarget(null)} />
    </>
  );
};

export default LearningResources;
