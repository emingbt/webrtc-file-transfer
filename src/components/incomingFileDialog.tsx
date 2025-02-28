"use client"

import type { IncomingData } from '../interface'
import { useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { FileIcon } from "lucide-react"
import fileDownload from "js-file-download"

export default function IncomingFileDialog({ data, open, setOpen }: {
  data: IncomingData | null,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {

  useEffect(() => {
    // Render the incoming file dialog only client-side
    if (typeof window === 'undefined') return
    if (open) {
      document.title = `Incoming File (1) | emin's file transfer`
      const audio = new Audio("/audio/incoming-file-alert-sound.wav")
      audio.play().catch(error => {
        console.error("Audio playback failed:", error)
      })
    } else {
      document.title = `emin's file transfer`
    }
  }
    , [open])


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Incoming File</AlertDialogTitle>
          <h2 className="text-lg text-gray-500 flex flex-row items-center">
            <FileIcon className="w-6 h-6" />
            <span className="ml-2">{data?.name}</span>
          </h2>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <p>File type: {data?.type}</p>
          <p>File size: {data?.size} bytes</p>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
            document.title = "emin's file transfer"
            if (data) {
              fileDownload(data.file, data.name, data.type)
            }
          }}>Download</AlertDialogAction>
          <AlertDialogCancel onClick={() => {
            document.title = "emin's file transfer"
          }}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}