import { IntegrationsContext } from "@/contexts/integrations";
import React from "react";

const useIntegrations = () => React.useContext(IntegrationsContext);

export default useIntegrations;
