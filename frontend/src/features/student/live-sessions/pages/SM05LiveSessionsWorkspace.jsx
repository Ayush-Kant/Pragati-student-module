import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Play, RefreshCw, Video } from 'lucide-react';
import { getLiveSessions, joinSession, leaveSession } from '../services/liveSessionsService';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import EmptyState from '../components/EmptyState';

const formatDateTime = (value) => {
  if (!value) return 'Schedule not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Schedule not available' : date.toLocaleString();
};

const getMinutes = (session) => {
  const serverMinutes = Number(session?.durationMinutes);
  if (Number.isFinite(serverMinutes) && serverMinutes >= 0) return serverMinutes;

  const text = String(session?.duration || '').trim().toLowerCase();
  const match = text.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m)?/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return 0;
  const unit = match[2] || 'minutes';
  return /^(hours?|hrs?|h)$/.test(unit) ? amount * 60 : amount;
};

const formatDuration = (minutes) => {
  const normalized = Number(minutes);
  if (!Number.isFinite(normalized) || normalized <= 0) return '—';
  if (normalized % 60 === 0) {
    const hours = normalized / 60;
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  if (normalized > 60) {
    const hours = Math.floor(normalized / 60);
    const remainder = normalized % 60;
    return `${hours}h ${remainder}m`;
  }
  return `${normalized} minutes`;
};

const statusForUi = (session) => session?.status === 'Completed' ? 'Past' : session?.status === 'Live' ? 'Live now' : 'Upcoming';

const toEmbeddableMeetingUrl = (value) => {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
      if (url.pathname === '/watch') {
        const videoId = url.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : value;
      }
      if (url.pathname.startsWith('/shorts/')) {
        const videoId = url.pathname.split('/')[2];
        return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : value;
      }
    }
    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.replace(/^\//, '').split('/')[0];
      return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : value;
    }
  } catch {
    return value;
  }
  return value;
};

export default function SM05LiveSessionsWorkspace() {
  const [sessions,setSessions]=useState([]); const [filter,setFilter]=useState('all'); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [joiningId,setJoiningId]=useState(null); const [activeRoom,setActiveRoom]=useState(null);
  const load=async()=>{setLoading(true);setError('');try{const data=await getLiveSessions();setSessions(Array.isArray(data)?data:[]);}catch(err){setError(err?.response?.data?.message||err?.message||'Unable to load live sessions.');}finally{setLoading(false);}};
  useEffect(()=>{load();},[]);
  const counts=useMemo(()=>({upcoming:sessions.filter(s=>s.status==='Upcoming'||s.status==='Scheduled').length,live:sessions.filter(s=>s.status==='Live').length,past:sessions.filter(s=>s.status==='Completed').length}),[sessions]);
  const filtered=useMemo(()=>sessions.filter(s=>filter==='upcoming'?(s.status==='Upcoming'||s.status==='Scheduled'):filter==='live'?s.status==='Live':filter==='past'?s.status==='Completed':true),[sessions,filter]);
  const handleJoin=async(session)=>{setJoiningId(session.id);setError('');try{const result=await joinSession(session.id);setActiveRoom({session,...result});}catch(err){setError(err?.response?.data?.message||err?.message||'Unable to join the session.');}finally{setJoiningId(null);}};
  const handleLeave=async()=>{if(!activeRoom?.session?.id)return;try{await leaveSession(activeRoom.session.id);}catch(err){setError(err?.response?.data?.message||err?.message||'Unable to record session exit.');}finally{setActiveRoom(null);load();}};
  if(activeRoom){const meetingUrl=activeRoom.meetingUrl||activeRoom.url||activeRoom.session?.meetingLink;const meetingSrc=toEmbeddableMeetingUrl(meetingUrl);const meetingSrcWithToken=meetingSrc&&activeRoom.token?`${meetingSrc}${meetingSrc.includes('?')?'&':'?'}t=${encodeURIComponent(activeRoom.token)}`:meetingSrc;return <StudentPageShell><StudentPageHeader title={activeRoom.session.title} subtitle={`With ${activeRoom.session.mentor||activeRoom.session.trainer||'mentor'} • ${formatDateTime(activeRoom.session.startTime)}`} action={<button type="button" onClick={handleLeave} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Leave session</button>}/><section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">{meetingSrcWithToken?<iframe title={activeRoom.session.title} src={meetingSrcWithToken} className="h-[70vh] min-h-[520px] w-full" allow="camera; microphone; fullscreen; display-capture"/>:<div className="grid min-h-[520px] place-items-center p-8 text-center text-white"><div><Video className="mx-auto mb-4 text-indigo-300" size={42}/><h2 className="text-lg font-bold">Daily room is ready</h2><p className="mt-2 max-w-md text-sm text-slate-300">The backend issued a participant token, but this session has no embeddable meeting URL configured yet.</p><span className="mt-4 inline-flex rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200">Configure DAILY_API_KEY and room URL</span></div></div>}</section><div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-slate-700">Attendance is finalized from recorded join/leave duration. The PRD rule is <strong>60% or more of the scheduled session duration</strong>.</div></StudentPageShell>;}
  return <StudentPageShell><StudentPageHeader title="Live Sessions" subtitle="Join upcoming mentor sessions, review attendance, and replay completed sessions." action={<button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw size={15}/> Refresh</button>}/>{error&&<div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}<div className="mb-6 grid grid-cols-3 gap-3"><button type="button" onClick={()=>setFilter('upcoming')} className={`rounded-2xl border p-4 text-left ${filter==='upcoming'?'border-indigo-300 bg-indigo-50':'border-slate-200 bg-white'}`}><Clock3 className="mb-2 text-indigo-600" size={18}/><div className="text-2xl font-black text-slate-900">{counts.upcoming}</div><div className="text-xs font-medium text-slate-500">Upcoming</div></button><button type="button" onClick={()=>setFilter('live')} className={`rounded-2xl border p-4 text-left ${filter==='live'?'border-emerald-300 bg-emerald-50':'border-slate-200 bg-white'}`}><Video className="mb-2 text-emerald-600" size={18}/><div className="text-2xl font-black text-slate-900">{counts.live}</div><div className="text-xs font-medium text-slate-500">Live now</div></button><button type="button" onClick={()=>setFilter('past')} className={`rounded-2xl border p-4 text-left ${filter==='past'?'border-slate-300 bg-slate-50':'border-slate-200 bg-white'}`}><CheckCircle2 className="mb-2 text-slate-500" size={18}/><div className="text-2xl font-black text-slate-900">{counts.past}</div><div className="text-xs font-medium text-slate-500">Past</div></button></div>{loading?<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({length:6},(_,i)=><div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200"/>)}</div>:!filtered.length?<EmptyState title="No sessions found" message="Scheduled sessions for your enrolled learning programme will appear here." icon="📅"/>:<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map(session=>{const status=statusForUi(session);const durationMinutes=getMinutes(session);const joinable=Boolean(session.joinable)||session.status==='Live';return <article key={session.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wide text-indigo-600">{session.category||'Live session'}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status==='Live now'?'bg-emerald-50 text-emerald-700':status==='Past'?'bg-slate-100 text-slate-600':'bg-indigo-50 text-indigo-700'}`}>{status}</span></div><h2 className="mt-3 line-clamp-2 text-lg font-black text-slate-900">{session.title}</h2><p className="mt-2 text-sm text-slate-500">{session.mentor||'Training Mentor'}</p><div className="mt-4 space-y-2 text-xs text-slate-600"><div className="flex items-center gap-2"><CalendarDays size={14}/>{formatDateTime(session.startTime)}</div><div className="flex items-center gap-2"><Clock3 size={14}/>{formatDuration(durationMinutes)}</div></div>{session.joinableAt&&status!=='Past'&&<p className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500">Join opens {formatDateTime(session.joinableAt)}.</p>}{status==='Past'&&<div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">Attendance: <strong>{session.attendanceStatus||(session.attended?'Present':'Not attended')}</strong>{session.recordingUrl?<a href={session.recordingUrl} target="_blank" rel="noreferrer" className="ml-2 font-semibold text-indigo-600 hover:text-indigo-700">Watch recording</a>:<span className="ml-2 text-slate-400">Recording pending</span>}</div>}<button type="button" disabled={!joinable||joiningId===session.id} onClick={()=>handleJoin(session)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{joiningId===session.id?'Joining...':status==='Past'?'Session completed':<><Play size={15}/> Join session</>}</button></article>})}</div>}</StudentPageShell>;
}
