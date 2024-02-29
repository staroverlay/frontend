import { PropsWithChildren, useEffect, useState } from 'react';

import Loading from '@/components/layout/loading';
import useAuth from '@/hooks/useAuth';
import { getMyProfile } from '@/services/profile';
import Profile from '@/services/profile/profile';

import { ProfileContext } from './profile-context';

export function ProfileProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getMyProfile();
      setProfile(profile);
      setFetched(true);
    };

    if (user) {
      fetchProfile();
    } else if (!fetched) {
      setFetched(true);
    }
  }, [user, fetched]);

  return (
    <ProfileContext.Provider value={{ setProfile, profile }}>
      <Loading loaded={fetched} message={'Loading profile'}>
        {children}
      </Loading>
    </ProfileContext.Provider>
  );
}
