import { Download, FileText, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { downloadResource } from '../../../services/studentCourse.service';

const formatBytes = (bytes) => {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 102.4) / 10} KB`;
  return `${Math.round(value / 104857.6) / 10} MB`;
};

export default function ResourceLibrary({ resources = [] }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');

  if (!resources.length) return null;

  const handleDownload = async (resource) => {
    if (downloadingId) return;
    setDownloadingId(resource.id ?? resource.resourceId);
    setError('');

    const popup = window.open('', '_blank', 'noopener,noreferrer');
    try {
      const result = await downloadResource(resource.id ?? resource.resourceId);
      if (!result?.downloadUrl) throw new Error('Download link was not returned.');
      if (popup) popup.location.href = result.downloadUrl;
      else window.location.href = result.downloadUrl;
    } catch (err) {
      popup?.close();
      setError(err?.response?.data?.message || err?.message || 'Unable to download resource.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Resource library</h3>
          <p className="mt-0.5 text-xs text-slate-500">Lesson resources are tracked when downloaded.</p>
        </div>
        <FileText size={17} className="text-blue-600" />
      </div>

      {error && <p className="mb-3 rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-700">{error}</p>}

      <div className="space-y-2">
        {resources.map((resource) => {
          const id = resource.id ?? resource.resourceId;
          const loading = downloadingId === id;
          return (
            <div key={id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                  <FileText size={16} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{resource.title}</p>
                  <p className="text-[11px] text-slate-400">
                    {resource.type || 'Resource'}{resource.fileSizeBytes ? ` • ${formatBytes(resource.fileSizeBytes)}` : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDownload(resource)}
                disabled={Boolean(downloadingId)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <LoaderCircle size={14} className="animate-spin" /> : <Download size={14} />}
                {loading ? 'Preparing...' : 'Download'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
