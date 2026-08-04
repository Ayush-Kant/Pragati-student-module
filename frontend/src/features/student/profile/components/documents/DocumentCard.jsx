import { FileText, X, Download, Eye } from 'lucide-react';
import { formatFileSize } from '../../utils/studentProfileHelpers';

const DocumentCard = ({ document, onDelete, isEditing = false }) => {
  if (!document) return null;

  const fileExtension = document.name.split('.').pop() || document.type;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-700/50 bg-white/5 p-4 transition-colors hover:border-orange-500/30">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{document.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400 uppercase">{fileExtension}</span>
            {document.size && <span className="text-xs text-gray-500">{formatFileSize(document.size)}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a href={document.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors" title="View document">
          <Eye className="h-4 w-4" />
        </a>
        <a href={document.url} download className="rounded-lg p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors" title="Download document">
          <Download className="h-4 w-4" />
        </a>
        {isEditing && onDelete && (
          <button type="button" onClick={() => onDelete(document.id)} className="rounded-lg p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete document">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
