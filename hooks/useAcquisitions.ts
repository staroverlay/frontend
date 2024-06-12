import React from 'react';

import { AcquisitionsContext } from '@/contexts/acquisitions';

const useAcquisitions = () => React.useContext(AcquisitionsContext);

export default useAcquisitions;
