import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  deleteLessonNote,
  getLessonNotes,
  saveLessonNote,
} from '../../../services/studentCourse.service';

const formatTimestamp = (seconds) => {
  if (seconds === null || seconds === undefined || seconds === '') return 'General note';
  const value = Math.max(0, Number(seconds) || 0);
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
};

export default function LessonNotes({ lessonId, currentTime = 0, onSeek }) {
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadNotes = async () => {
    if (!lessonId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getLessonNotes(lessonId);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to load notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNotes([]);
    setDraft('');
    setEditingId(null);
    loadNotes();
  }, [lessonId]);

  const handleSave = async () => {
    if (!draft.trim() || saving) return;
    setSaving(true);
    setError('');
    try {
      const result = await saveLessonNote(lessonId, {
        note: draft.trim(),
        timestampSeconds: editingId ? notes.find((note) => note.id === editingId)?.timestampSeconds ?? null : Math.floor(currentTime),
        noteId: editingId || undefined,
      });
      setNotes((current) => editingId
        ? current.map((note) => (note.id === editingId ? result : note))
        : [...current, result]);
      setDraft('');
      setEditingId(null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to save note.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId) => {
    setError('');
    try {
      await deleteLessonNote(lessonId, noteId);
      setNotes((current) => current.filter((note) => note.id !== noteId));
      if (editingId === noteId) {
        setEditingId(null);
        setDraft('');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to delete note.');
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Lesson notes</h3>
          <p className="mt-0.5 text-xs text-slate-500">Save notes against the current video position.</p>
        </div>
        {currentTime > 0 && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{formatTimestamp(currentTime)}</span>}
      </div>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Write a note..."
        maxLength={5000}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!draft.trim() || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {editingId ? <Save size={14} /> : <Plus size={14} />}
          {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add note'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setDraft('');
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <X size={14} /> Cancel
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
      {loading && <p className="mt-4 text-sm text-slate-500">Loading notes...</p>}

      {!loading && notes.length === 0 && (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">No notes for this lesson yet.</p>
      )}

      {!loading && notes.length > 0 && (
        <div className="mt-4 space-y-2">
          {notes.map((note) => (
            <article key={note.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => note.timestampSeconds !== null && onSeek?.(note.timestampSeconds)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="mb-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    {formatTimestamp(note.timestampSeconds)}
                  </span>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{note.note}</p>
                </button>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label="Edit note"
                    onClick={() => {
                      setEditingId(note.id);
                      setDraft(note.note);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete note"
                    onClick={() => handleDelete(note.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
