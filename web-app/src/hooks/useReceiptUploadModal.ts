import { useState, DragEvent, ChangeEvent } from "react";
import { uploadExpenses } from "../api/expenseApi";
import { toast } from "sonner";
import { IExpenseItem } from "../types/api";

interface UseReceiptUploadModalReturn {
  isDragging: boolean;
  selectedFiles: File[];
  error: string;
  previews: string[];
  showUploadModal: boolean;
  setShowUploadModal: (show: boolean) => void;
  handleDragEnter: (event: DragEvent<HTMLLabelElement>) => void;
  handleDragOver: (event: DragEvent<HTMLLabelElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (event: DragEvent<HTMLLabelElement>) => void;
  handleFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => Promise<void>;
  handleRemoveFile: (index: number) => void;
  handleDeselectAll: () => void;
}

export default function useReceiptUploadModal(
  setExpenses: React.Dispatch<React.SetStateAction<IExpenseItem[]>>,
  spreadsheetId: string | null
): UseReceiptUploadModalReturn {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) =>
      ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(
        file.type
      )
    );

    if (validFiles.length !== files.length) {
      setError(
        "Some files were rejected. Only PDF, JPEG, PNG and WEBP files are allowed."
      );
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    generatePreviews(validFiles);
  };

  const generatePreviews = (files: File[]) => {
    files.forEach((file) => {
      if (file.type === "application/pdf") {
        setPreviews((prev) => [...prev, "/pdf-icon.png"]);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeselectAll = () => {
    setSelectedFiles([]);
    setPreviews([]);
  };

  const handleUpload = async () => {
    try {
      // Removed FormData creation since we directly pass selectedFiles
      const response = await uploadExpenses(selectedFiles, spreadsheetId);
      setExpenses((prev: IExpenseItem[]) => [...prev, ...response]);
      setShowUploadModal(false);
      handleDeselectAll();
      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload files");
    }
  };

  return {
    isDragging,
    selectedFiles,
    error,
    previews,
    showUploadModal,
    setShowUploadModal,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleUpload,
    handleRemoveFile,
    handleDeselectAll,
  };
}
