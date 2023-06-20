import { useDisclosure } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import UploadModal from "../../components/modals/upload-modal/UploadModal";

import IMedia from "../../lib/interfaces/media";
import { getAllMedia } from "../../lib/services/media";
import { MediaContext } from "./media-context";

export function MediaProvider({ children }: PropsWithChildren) {
  const [medias, setMedias] = useState<IMedia[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [fetched, setFetched] = useState(false);

  const fetchMedia = async () => {
    const medias = await getAllMedia();
    setMedias(medias);
  };

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

  useEffect(() => {
    if (!fetched) {
      setFetched(true);
      fetchMedia();
    }
  }, [fetched]);

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
      {fetched && children}
    </MediaContext.Provider>
  );
}
