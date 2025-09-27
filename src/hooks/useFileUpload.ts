"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useAction, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { UPLOAD_CONFIG } from "@/lib/config"
import { uploadHelpers } from "@/lib/utils"

export interface LocalFile {
  id: string
  file: File
}

export interface UseFileUploadOptions {
  onUploadComplete?: () => Promise<void> | void
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<Array<LocalFile>>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<Array<string>>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const accept = useMemo(() => UPLOAD_CONFIG.allowedMimeTypes.join(','), [])

  const generateUploadUrl = useAction((api as any).files.generateUploadUrl)
  const saveFile = useMutation((api as any).files.saveFile)

  const openFileDialog = useCallback(() => inputRef.current?.click(), [])

  const appendFiles = useCallback((files: FileList | Array<File>) => {
    const list = Array.from(files)
    const remainingSlots = Math.max(UPLOAD_CONFIG.maxFiles - selectedFiles.length, 0)
    if (remainingSlots <= 0) return
    const nextFiles: Array<LocalFile> = []
    const nextErrors: Array<string> = []
    for (const file of list) {
      if (!uploadHelpers.validateFile(file)) {
        nextErrors.push(`Nicht erlaubt: ${file.name}`)
        continue
      }
      if (file.size > UPLOAD_CONFIG.maxSizeBytes) {
        nextErrors.push(`Zu groß: ${file.name}`)
        continue
      }
      const id = (globalThis as any).crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`
      nextFiles.push({ id, file })
      if (nextFiles.length >= remainingSlots) break
    }
    if (nextErrors.length) setErrors(nextErrors)
    if (nextFiles.length) setSelectedFiles((prev) => [...prev, ...nextFiles])
  }, [selectedFiles.length])

  const removeFile = useCallback((id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearFiles = useCallback(() => setSelectedFiles([]), [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    appendFiles(e.target.files)
    e.currentTarget.value = ""
  }, [appendFiles])

  const withPrevent = useCallback(
    <E extends { preventDefault: () => void; stopPropagation: () => void }>(
      handler: (e: E) => void,
    ) => (e: E) => {
      e.preventDefault()
      e.stopPropagation()
      handler(e)
    },
    [],
  )

  const handleDragEnter = useCallback(
    withPrevent<React.DragEvent>(() => setIsDragging(true)),
    [withPrevent],
  )
  const handleDragLeave = useCallback(
    withPrevent<React.DragEvent>(() => setIsDragging(false)),
    [withPrevent],
  )
  const handleDragOver = useCallback(
    withPrevent<React.DragEvent>(() => {}),
    [withPrevent],
  )
  const handleDrop = useCallback(
    withPrevent<React.DragEvent>((e) => {
      setIsDragging(false)
      const dt = e.dataTransfer
      if (dt?.files?.length) appendFiles(dt.files)
    }),
    [appendFiles, withPrevent],
  )

  const uploadSingleFile = useCallback(async (file: File): Promise<boolean> => {
    if (!uploadHelpers.validateFile(file)) {
      setErrors(["Datei-Format nicht erlaubt"])
      return false
    }
    if (file.size > UPLOAD_CONFIG.maxSizeBytes) {
      setErrors([`Datei zu groß (max. ${UPLOAD_CONFIG.maxSizeMB}MB)`])
      return false
    }
    try {
      const uploadUrl: string = await generateUploadUrl({})
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      if (!response.ok) {
        return false
      }
      const { storageId } = await response.json()
      const uniqueFileName = uploadHelpers.generateUniqueFileName(file.name)
      await saveFile({
        storageId,
        fileName: uniqueFileName,
        contentType: file.type,
        size: file.size,
      })
      return true
    } catch {
      return false
    }
  }, [generateUploadUrl, saveFile])

  const handleUpload = useCallback(async () => {
    if (isUploading) return
    setIsUploading(true)
    try {
      const results = await Promise.all(
        selectedFiles.map((lf) => uploadSingleFile(lf.file)),
      )
      const successCount = results.filter(Boolean).length
      const hasAnyFailure = results.some((ok) => !ok)

      setSelectedFiles([])

      if (successCount > 0) {
        await options?.onUploadComplete?.()
      }

      if (hasAnyFailure && successCount === 0) {
        setErrors(["Upload fehlgeschlagen"])
      }
    } finally {
      setIsUploading(false)
    }
  }, [isUploading, selectedFiles, uploadSingleFile, options])

  return {
    isUploading,
    selectedFiles,
    isDragging,
    errors,
    accept,
    inputRef,
    openFileDialog,
    appendFiles,
    removeFile,
    clearFiles,
    handleInputChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleUpload,
  }
}