import { useDisclosure } from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";
import UploadModal from "../../components/modals/upload-modal/UploadModal";

import IMedia from "../../lib/interfaces/media";
import { MediaContext } from "./media-context";

export function MediaProvider({ children }: PropsWithChildren) {
  const [medias, setMedias] = useState<IMedia[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [fetched, setFetched] = useState(false);

  const removeMedia = (media: IMedia | string) => {
    const id = typeof media === "string" ? media : media._id;
    setMedias(medias.filter((m) => m._id !== id));
  };

  const addMedia = (media: IMedia) => {
    setMedias([...medias, media]);
  };

  const updateMedia = (media: IMedia) => {
    setMedias(medias.map((m) => (m._id === media._id ? media : m)));
  };

  const openUploadModal = () => {
    onOpen();
  };

  return (
    <MediaContext.Provider
      value={{
        medias,
        removeMedia,
        addMedia,
        updateMedia,
        isUploadModalOpen: isOpen,
        openUploadModal,
      }}
    >
      <UploadModal isOpen={isOpen} onClose={onClose} />
      {children}
    </MediaContext.Provider>
  );
}
