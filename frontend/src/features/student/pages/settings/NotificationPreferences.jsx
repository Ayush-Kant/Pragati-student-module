import { useEffect, useMemo, useState } from "react";
import { Bell, Mail, Save, Smartphone, Volume2 } from "lucide-react";
import StudentPageShell from "../../components/common/StudentPageShell";
import StudentPageHeader from "../../components/common/StudentPageHeader";
import {
  getNotificationPreferences,
  getPushPublicKey,
  subscribeToPush,
  updateNotificationPreferences,
} from "../../../../services/notification.service";

const META = {
  grade_released: { label: "Grade released", description: "When a mentor grades one of your submissions." },
  session_scheduled: { label: "Session scheduled", description: "When a new learning or live session is added." },
  assignment_published: { label: "Assignment published", description: "When a mentor publishes an assignment for you." },
  shortlisted: { label: "Shortlisted", description: "When you are shortlisted for a placement drive." },
  interview_invited: { label: "Interview invitation", description: "When an interview is scheduled or invitation is sent." },
  interview_outcome: { label: "Interview outcome", description: "When an interview result is published." },
  platform_announcement: { label: "Platform announcements", description: "Important announcements from the Pragati platform." },
  certificate_issued: { label: "Certificate issued", description: "When a certificate is generated for you." },
};

const CHANNELS = [
  { key: "inApp", label: "In-app", icon: Bell },
  { key: "email", label: "Email", icon: Mail },
  { key: "push", label: "Push", icon: Smartphone },
];

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pushStatus, setPushStatus] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getNotificationPreferences();
      setPreferences(result?.preferences || {});
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load preferences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const orderedTypes = useMemo(() => Object.keys(META), []);

  const toggle = (type, channel) => {
    setPreferences((current) => ({
      ...current,
      [type]: {
        ...(current[type] || { inApp: true, email: false, push: false }),
        [channel]: !(current[type]?.[channel] ?? false),
      },
    }));
    setMessage("");
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await updateNotificationPreferences(preferences);
      setPreferences(result?.preferences || preferences);
      setMessage("Preferences saved successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const enablePush = async () => {
    setPushStatus("");
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushStatus("Browser push is not supported in this browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushStatus("Push permission was not granted.");
        return;
      }

      const keyResult = await getPushPublicKey();
      const registration = await navigator.serviceWorker.register("/sw.js");
      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(keyResult.publicKey),
        }));

      await subscribeToPush(subscription.toJSON());
      setPreferences((current) => ({
        ...current,
        session_scheduled: { ...(current.session_scheduled || {}), push: true },
        shortlisted: { ...(current.shortlisted || {}), push: true },
        interview_invited: { ...(current.interview_invited || {}), push: true },
        interview_outcome: { ...(current.interview_outcome || {}), push: true },
      }));
      setPushStatus("Browser push notifications are enabled on this device.");
    } catch (err) {
      setPushStatus(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to enable browser push. Configure VAPID keys on the server first.",
      );
    }
  };

  return (
    <StudentPageShell>
      <StudentPageHeader title="Notification Preferences" subtitle="Choose where each type of Pragati update should reach you." />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><Volume2 size={20} /></div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Browser push notifications</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">Enable push alerts for supported events on this device.</p>
            </div>
          </div>
          <button type="button" onClick={enablePush} className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">Enable browser push</button>
        </div>
        {pushStatus && <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">{pushStatus}</p>}
      </div>

      {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {message && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,80px)] border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <span>Notification type</span>
          {CHANNELS.map(({ key, label, icon: Icon }) => <span key={key} className="flex flex-col items-center gap-1"><Icon size={14} />{label}</span>)}
        </div>

        {loading ? (
          <div className="space-y-3 p-5">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div>
        ) : (
          <div>
            {orderedTypes.map((type) => {
              const values = preferences[type] || { inApp: true, email: false, push: false };
              return (
                <div key={type} className="grid grid-cols-[minmax(0,1fr)_repeat(3,80px)] items-center border-b border-slate-100 px-5 py-4 last:border-b-0">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-slate-900">{META[type].label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{META[type].description}</p>
                  </div>
                  {CHANNELS.map(({ key }) => (
                    <div key={key} className="flex justify-center">
                      <button type="button" onClick={() => toggle(type, key)} aria-pressed={Boolean(values[key])} className={`h-7 w-12 rounded-full p-1 transition ${values[key] ? "bg-blue-600" : "bg-slate-200"}`}>
                        <span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition ${values[key] ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={save} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          <Save size={16} /> {saving ? "Saving…" : "Save preferences"}
        </button>
      </div>
    </StudentPageShell>
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String?.length || 0) % 4) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
