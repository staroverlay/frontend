import React from 'react';

import { ProfileContext } from '@/contexts/profile';

const useProfile = () => React.useContext(ProfileContext);

export default useProfile;
