import { ChangeEvent, FormEvent, useState } from "react";
import {
  Button,
  Flex,
  Input,
  chakra,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FileUploader } from "react-drag-drop-files";
import BaseModal from "../base-modal/BaseModal";
import FilePreview from "../../content/file-preview/FilePreview";
import { uploadFile } from "../../../lib/services/storage";
import useMedia from "../../../hooks/useMedia";

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
  const [error, setError] = useState<string | null>(null);

  const handleUploadFile = async () => {
    if (!file || !name) {
      setError("Please select a file and a name");
      return;
    }

    const media = await uploadFile(file, name);
    addMedia(media);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(null);
  };

  const handleFileChange = (file: File) => {
    setFile(file);
    if (error) setError(null);
  };

  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (uploading) return;

    setUploading(true);
    handleUploadFile()
      .catch((e) => setError(e.message))
      .finally(() => setUploading(false));
  };

  return (
    <BaseModal title={"Upload a file"} isOpen={isOpen} onClose={onClose}>
      <Flex
        as={chakra.form}
        direction={"column"}
        gap={"10px"}
        onSubmit={handleSubmit}
      >
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
