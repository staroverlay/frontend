import React from "react";

import { AuthContext } from "../contexts/auth";

const useAuth = () => React.useContext(AuthContext);

export default useAuth;
