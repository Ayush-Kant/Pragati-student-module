import React from 'react';
import { useProfileData } from './hooks/useProfileData';

export default function ProfileTestPage() {
  const { data: college, isLoading, error, refetch } = useProfileData();

  if (isLoading) return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>⏳ Loading College Details...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>❌ Error: {error}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px', margin: '2rem' }}>
      <h2>🏫 {college.collegeName}</h2>
      <p><strong>Email:</strong> {college.email}</p>
      <p><strong>Phone:</strong> {college.phoneNumber}</p>
      <p><strong>Address:</strong> {college.address.street}, {college.address.city}</p>
      <button onClick={refetch} style={{ marginTop: '1rem', padding: '8px 16px', cursor: 'pointer' }}>
        🔄 Test Refetch Trigger
      </button>
    </div>
  );
}