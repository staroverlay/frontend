import React from 'react';

import { WidgetsContext } from '../contexts/widgets';

const useWidgets = () => React.useContext(WidgetsContext);

export default useWidgets;
