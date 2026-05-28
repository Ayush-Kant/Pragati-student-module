import { useRef, useState } from "react";

const AdminAvatarUpload = ({ avatarUrl, fullName, setValue }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(avatarUrl || null);
  const [hasError, setHasError] = useState(false);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setHasError(false);
    if (setValue) setValue("avatarUrl", url, { shouldValidate: true, shouldDirty: true });
  };

  const initial = fullName?.trim()?.charAt(0)?.toUpperCase() || "A";
  const showImg = (preview || avatarUrl) && !hasError;

  return (
    <div onClick={() => fileInputRef.current?.click()} style={{
      border: "2px dashed #c7d2fe", borderRadius: 14,
      padding: "20px 18px", display: "flex", alignItems: "center",
      gap: 18, background: "#fafafe", cursor: "pointer", marginBottom: 20,
    }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: showImg ? "transparent" : "linear-gradient(135deg,#818cf8,#a78bfa)",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          fontSize: 24, fontWeight: 800, color: "#fff",
        }}>
          {showImg
            ? <img src={preview || avatarUrl} alt="" onError={() => setHasError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : initial}
        </div>
        <div style={{
          position: "absolute", bottom: 0, right: 0, width: 22, height: 22,
          borderRadius: "50%", background: "#6366f1", display: "flex",
          alignItems: "center", justifyContent: "center", border: "2px solid #fff",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
            <path d="M12 15.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4zm7-11.2h-1.5l-1.3-2H8.8L7.5 4H6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3z" />
          </svg>
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 4 }}>Profile Photo</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>JPG, GIF or PNG. Max size 2MB.</div>
        <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 13 }}>Upload New Picture</span>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleChange} />
    </div>
  );
};

export default AdminAvatarUpload;
