import React from 'react';

export default function AdminFooter({ darkMode }) {
  return (
    <footer className={`py-4 px-6 text-center text-sm border-t ${darkMode ? 'bg-gray-900 text-gray-400 border-gray-700' : 'bg-white text-gray-500 border-gray-200'}`}>
      © {new Date().getFullYear()} Pragati Admin. All rights reserved.
    </footer>
  );
}
