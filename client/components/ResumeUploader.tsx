"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, FileText } from "lucide-react";

interface ResumeUploaderProps {
  onFilesUpload: (files: File[]) => void;
  isUploading: boolean;
  uploadedFiles: string[];
}

export function ResumeUploader({
  onFilesUpload,
  isUploading,
  uploadedFiles,
}: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      onFilesUpload(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesUpload(files);
    }
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleChange}
          disabled={isUploading}
          multiple
        />

        <div className="flex flex-col items-center justify-center p-6 text-center">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                Uploading resumes...
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 mb-4 rounded-full bg-primary/10">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <p className="mb-2 text-sm font-medium">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF or DOCX (max. 10MB per file)
              </p>
              <Button
                variant="outline"
                onClick={onButtonClick}
                className="mt-4"
                disabled={isUploading}
              >
                <File className="w-4 h-4 mr-2" />
                Select Resumes
              </Button>
            </>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="font-medium">Uploaded Files:</div>
          <div className="grid gap-2">
            {uploadedFiles.map((fileName) => (
              <div
                key={fileName}
                className="flex items-center gap-2 p-2 text-sm bg-muted rounded-lg"
              >
                <FileText className="w-4 h-4 text-primary" />
                {fileName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
