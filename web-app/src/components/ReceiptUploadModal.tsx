import React, { useState } from "react";
import { Button } from "./ui/Button";
import { UploadFileIcon } from "../assets/icons";
import useReceiptUploadModal from "../hooks/useReceiptUploadModal";
import { IExpenseItem } from "../types/api";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "./ui/Select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from "./ui/Dialog";

export interface ReceiptUploadModalProps { 
  setExpenses: React.Dispatch<React.SetStateAction<IExpenseItem[]>>;
  spreadsheetId: string | null;
}

const ReceiptUploadModal: React.FC<ReceiptUploadModalProps> = ({
  setExpenses,
  spreadsheetId,
}) => {
  const availableOCRs = ["GPT-4o-mini", "DeepSeek-R1", "AWS Textract"];
  const [selectedOCR, setSelectedOCR] = useState<string>(availableOCRs[0]);
  const {
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
  } = useReceiptUploadModal(setExpenses, spreadsheetId);

  return (
    <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
      <DialogTrigger asChild>
        <Button>
          <img src={UploadFileIcon} className="mr-2" alt="upload icon" /> Upload Receipts
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Upload Receipts
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-600">Note:</p>
          <ul className="text-sm text-gray-600 list-disc pl-5">
            <li>Larger file sizes provide better data quality.</li>
            <li>Each file should contain only one receipt.</li>
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-600">Model:</p>
          <Select value={selectedOCR} onValueChange={setSelectedOCR}>
            <SelectTrigger className="w-full">{selectedOCR}</SelectTrigger>
            <SelectContent>
              {availableOCRs.map((ocr) => (
                <SelectItem key={ocr} value={ocr}>
                  {ocr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label
          className={`flex flex-col items-center justify-center border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg h-64 transition-colors duration-300 cursor-pointer mt-4 ${
            isDragging ? "border-blue-500 bg-blue-50" : "hover:bg-gray-100"
          }`}
          htmlFor="fileInput"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-3">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="https://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, JPEG, PNG, WEBP files only</p>
          </div>
          <input
            id="fileInput"
            type="file"
            multiple
            accept="application/pdf, image/jpeg, image/png, image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
        {selectedFiles.length > 0 && (
          <div className="mb-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Selected files:</p>
              <button
                onClick={handleDeselectAll}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Deselect All
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-3 text-sm text-gray-500">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <svg
                      xmlns="https://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {previews[index] && (
                    <img
                      src={previews[index]}
                      className="w-24 h-24 object-cover rounded"
                      alt="Preview"
                    />
                  )}
                  <span className="truncate flex-grow">{(file as File).name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && <div className="text-sm text-red-500">{error}</div>}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
            variant="default"
            className="flex-1 px-6"
          >
            {selectedFiles.length === 0
              ? "No files selected"
              : `Upload ${selectedFiles.length} ${
                  selectedFiles.length === 1 ? "file" : "files"
                }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptUploadModal;