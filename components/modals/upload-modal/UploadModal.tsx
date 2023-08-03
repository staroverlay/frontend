import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Button, Flex, Input, chakra } from "@chakra-ui/react";
import { FileUploader } from "react-drag-drop-files";
import BaseModal from "../base-modal/BaseModal";
import FilePreview from "../../content/file-preview/FilePreview";
import { uploadFile } from "../../../lib/utils/storage";
import useMedia from "../../../hooks/useMedia";
import { toastPending } from "../../../lib/utils/toasts";

const fileTypes = ["JPG", "PNG", "GIF", "WEBP", "MP3", "MP4", "WEBM"];

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { addMedia } = useMedia();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const setName = (name: string) => {
    if (nameInputRef.current) {
      nameInputRef.current.value = name;
    }
  };

  const getName = () => {
    return nameInputRef.current?.value || "";
  };

  const handleClose = () => {
    setFile(null);
    setName("");
    onClose();
  };

  const handleUploadFile = async () => {
    if (!file) {
      throw new Error("File are required");
    }

    const media = await uploadFile(file, getName());
    addMedia(media);
  };

  const handleFileChange = (file: File) => {
    setFile(file);
    setName(file.name);
  };

  const handleSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (uploading) return;

    setUploading(true);
    await toastPending(handleUploadFile, {
      pending: "Uploading file",
      success: "File uploaded",
    });
    setUploading(false);
    handleClose();
  };

  return (
    <BaseModal title={"Upload a file"} isOpen={isOpen} onClose={handleClose}>
      <Flex
        as={chakra.form}
        direction={"column"}
        gap={"10px"}
        onSubmit={handleSubmit}
      >
        <FileUploader
          handleChange={handleFileChange}
          name="file"
          types={fileTypes}
          maxSize={10}
          required
        >
          {file && <FilePreview file={file} />}
        </FileUploader>

        {file && (
          <>
            <Input ref={nameInputRef} placeholder="File name" required />

            <Button disabled={uploading} type={"submit"}>
              Upload
            </Button>
          </>
        )}
      </Flex>
    </BaseModal>
  );
}
