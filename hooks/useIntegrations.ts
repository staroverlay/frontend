import React from "react";

import { IntegrationsContext } from "@/contexts/integrations";

const useIntegrations = () => React.useContext(IntegrationsContext);

export default useIntegrations;
