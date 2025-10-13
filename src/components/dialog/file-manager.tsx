"use client"

import { memo, useEffect, useState } from "react"
import Image from "next/image"
import { X, FileIcon, Loader2, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { formatBytes } from "@/lib/utils"
import { UPLOAD_CONFIG } from "@/lib/config"
import { useConvex } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useFileUpload, type LocalFile } from "@/hooks/useFileUpload"
import type { Id } from "../../../convex/_generated/dataModel"

interface FileManagerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectImage?: (
    url: string,
    storageId?: string,
    file?: Pick<FileData, "fileName" | "size">
  ) => void
  currentImage?: string
}

interface FileData {
  fileName: string
  url: string
  storageId: Id<"_storage">
  isPublic: boolean
  created_at: string
  size: number
}

const FileUploadArea = ({ onUploadComplete }: { onUploadComplete: () => Promise<void> }) => {
  const {
    isUploading,
    selectedFiles,
    isDragging,
    errors,
    accept,
    inputRef,
    openFileDialog,
    removeFile,
    clearFiles,
    handleInputChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleUpload,
  } = useFileUpload({ onUploadComplete })

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-dragging={isDragging || undefined}
      className={`border-input data-[dragging=true]:bg-accent/50 relative flex flex-col items-center overflow-hidden rounded-xl border-2 p-4 transition-colors ${
        selectedFiles.length === 0 ? 'border-dashed cursor-pointer hover:bg-accent/30' : 'border-solid'
      }`}
    >
      <input ref={inputRef} type="file" accept={accept} multiple onChange={handleInputChange} className="sr-only" />
      
      {selectedFiles.length > 0 ? (
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-medium">Dateien zum Upload ({selectedFiles.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <Loader2 className="-ms-0.5 size-3.5 opacity-60 animate-spin" />
                ) : (
                  <Upload className="-ms-0.5 size-3.5 opacity-60" />
                )}
                {isUploading ? "Hochladen..." : "Hochladen"}
              </Button>
              <Button variant="outline" size="sm" onClick={clearFiles} disabled={isUploading}>
                <X className="-ms-0.5 size-3.5 opacity-60" />
                Abbrechen
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {selectedFiles.map((file) => (
              <UploadPreviewCard key={file.id} file={file} onRemove={removeFile} />
            ))}
          </div>
        </div>
      ) : (
        <div onClick={openFileDialog} className="flex flex-col items-center justify-center px-4 py-4 text-center">
          <Upload className="size-8 opacity-60 text-muted-foreground mb-2" />
          <p className="mb-1.5 text-sm font-medium">Klicken zum Hochladen oder per Drag & Drop hinzufügen</p>
          <p className="text-muted-foreground text-xs">
            {UPLOAD_CONFIG.allowedExtensionsText} (max. {UPLOAD_CONFIG.maxSizeMB} MB)
          </p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs">
          <AlertCircle className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}

const UploadPreviewCard = memo(({ file, onRemove }: { file: LocalFile, onRemove: (id: string) => void }) => {
  const isImage = file.file instanceof File && file.file.type.startsWith("image/")
  return (
    <div className="bg-background relative flex flex-col rounded-md border">
      <div className="bg-accent relative flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]">
        {isImage ? (
          <Image
            src={URL.createObjectURL(file.file)}
            alt={file.file.name}
            fill
            className="rounded-t-[inherit] object-cover"
            unoptimized
          />
        ) : (
          <FileIcon className="size-5 opacity-60" />
        )}
      </div>
      <Button onClick={() => onRemove(file.id)} size="icon" variant="destructive" className="absolute -top-2 -right-2 size-6">
        <X className="size-3.5" />
      </Button>
      <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
        <p className="truncate text-[13px] font-medium">{file.file?.name ?? ""}</p>
        <p className="text-muted-foreground truncate text-xs">
          {file.file ? formatBytes(file.file.size) : ""}
        </p>
      </div>
    </div>
  )
})

const ImageCard = memo(({ file, isSelected, onSelect }: {
  file: FileData;
  isSelected: boolean;
  onSelect: (
    url: string,
    storageId: Id<"_storage">,
    file: Pick<FileData, "fileName" | "size">
  ) => void;
}) => (
  <div className={`bg-muted relative flex flex-col rounded-lg p-1.5 ${isSelected ? "ring-2 ring-primary ring-offset-6 bg-primary/10" : ""}`}>
    <div 
      className="bg-accent relative flex flex-col aspect-square items-center justify-center overflow-visible rounded-md cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => onSelect(file.url, file.storageId, file)}
    >
      <Image src={file.url} alt={file.fileName} fill className="object-cover rounded-md" unoptimized />
    </div>
  </div>
))

export function FileManagerDialog({ open, onOpenChange, onSelectImage, currentImage }: FileManagerDialogProps) {
  const convex = useConvex()
  const [files, setFiles] = useState<FileData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadFiles = async () => {
    setIsLoading(true)
    try {
      const result = await convex.query(api.files.listUserFiles, {})
      setFiles(result as FileData[])
    } catch (error) {
      console.error("Fehler beim Laden der Dateien:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      void loadFiles()
    }
  }, [open])

  const handleSelectImage = (
    url: string,
    storageId: Id<"_storage">,
    file: Pick<FileData, "fileName" | "size">
  ) => {
    onSelectImage?.(url, storageId, file)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex -mt-2 flex-row items-center justify-between">
          <DialogTitle className="text-lg flex items-center">
            Bilder hochladen
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <FileUploadArea onUploadComplete={loadFiles} />
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground font-regular">
                Aus vorhandenen Bildern wählen
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5 max-h-[150px] xl:max-h-[250px] overflow-y-auto p-1
            [&::-webkit-scrollbar]:w-1.5 
            [&::-webkit-scrollbar-thumb]:bg-muted-foreground/10
            [&::-webkit-scrollbar-thumb]:cursor-pointer
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))
            ) : (
              files.map((file) => (
                <ImageCard
                  key={file.storageId}
                  file={file}
                  isSelected={currentImage === file.url}
                  onSelect={handleSelectImage}
                />
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 