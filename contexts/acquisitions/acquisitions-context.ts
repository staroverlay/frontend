import React from 'react';

import { AcquisitionsHook } from './acquisitions-hook';

export const AcquisitionsContext = React.createContext<AcquisitionsHook>({
  acquisitions: [],
  addAcquisition: () => {},
  isAcquired: () => false,
});
