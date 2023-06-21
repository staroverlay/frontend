import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Flex, Input, chakra } from "@chakra-ui/react";
import { FileUploader } from "react-drag-drop-files";
import BaseModal from "../base-modal/BaseModal";
import FilePreview from "../../content/file-preview/FilePreview";
import { uploadFile } from "../../../lib/services/storage";
import useMedia from "../../../hooks/useMedia";
import { toastPending } from "../../../lib/utils/toasts";

const fileTypes = ["JPG", "PNG", "GIF", "WEBP", "MP3", "MP4", "WEBM"];

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { addMedia } = useMedia();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const handleClose = () => {
    setFile(null);
    setName("");
    onClose();
  };

  const handleUploadFile = async () => {
    if (!file || !name) {
      throw new Error("File and name are required");
    }

    const media = await uploadFile(file, name);
    addMedia(media);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = (file: File) => {
    setFile(file);
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
          file={file}
          types={fileTypes}
          maxSize={10}
          required
        >
          {file && <FilePreview file={file} />}
        </FileUploader>

        {file && (
          <>
            <Input
              onChange={handleNameChange}
              value={name}
              placeholder="File name"
              required
            />

            <Button disabled={uploading} type={"submit"}>
              Upload
            </Button>
          </>
        )}
      </Flex>
    </BaseModal>
  );
}
