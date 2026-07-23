import React from 'react';

export default function AdminAvatarUpload({ avatarUrl, fullName, setValue }) {
  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'A';

  return (
    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
      {avatarUrl ? (
        <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white text-3xl font-bold">{initials}</span>
      )}
    </div>
  );
}
