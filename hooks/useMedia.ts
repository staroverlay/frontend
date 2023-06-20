import React from "react";
import { MediaContext } from "../contexts/media";

const useMedia = () => React.useContext(MediaContext);

export default useMedia;
