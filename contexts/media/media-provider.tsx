import useAuth from "@/hooks/useAuth";
import { useDisclosure } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import Loading from "../../components/layout/loading";
import UploadModal from "../../components/modals/upload-modal/UploadModal";

import IMedia from "../../lib/interfaces/media";
import { getAllMedia } from "../../lib/services/media-service";
import { MediaContext } from "./media-context";

function getStorageUsage(medias: IMedia[]) {
  let storage = 0;

  for (const media of medias) {
    storage += media.size;
  }

  return storage;
}

export function MediaProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [medias, setMedias] = useState<IMedia[]>([]);
  const storageUsage = getStorageUsage(medias);
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

  useEffect(() => {
    const fetchMedia = async () => {
      const medias = await getAllMedia();
      setMedias(medias);
      setFetched(true);
    };

    if (user) {
      fetchMedia();
    } else if (!fetched) {
      setFetched(true);
    }
  }, [user, fetched]);

  return (
    <MediaContext.Provider
      value={{
        medias,
        removeMedia,
        addMedia,
        updateMedia,
        storageUsage,
        isUploadModalOpen: isOpen,
        openUploadModal,
      }}
    >
      <UploadModal isOpen={isOpen} onClose={onClose} />
      <Loading loaded={fetched} message={"Loading media"}>
        {children}
      </Loading>
    </MediaContext.Provider>
  );
}
