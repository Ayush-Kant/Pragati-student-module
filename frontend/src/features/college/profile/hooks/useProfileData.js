import { useState, useEffect } from 'react';

export default function useProfileData() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile({});
  }, []);

  return { profile };
}
