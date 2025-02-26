"use client"

import type { DataConnection } from "peerjs"
import type { IncomingData } from "@/interface"
import { useState } from "react"
import { peerService } from "@/lib/peerService"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ConnectPeer from "@/components/connectPeer"
import IncomingFileDialog from "@/components/incomingFileDialog"
import CopyButton from "@/components/copyButton"

export default function Home() {
  const [peerId, setPeerId] = useState<string | null>(null)
  const [connection, setConnection] = useState<DataConnection | null>(null)
  const [isLoadingStart, setIsLoadingStart] = useState(false)
  const [incomingData, setIncomingData] = useState<IncomingData | null>(null)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  const createPeer = () => {
    setIsLoadingStart(true)
    peerService.createPeer((id) => {
      setPeerId(id)
      setIsLoadingStart(false)
    }, (conn) => {
      setConnection(conn)
    }, (data) => {
      setIncomingData(data)
      setIsAlertDialogOpen(true)
    }, () => {
      setConnection(null)
    })
  }

  const destroyPeer = () => {
    peerService.destroyPeer()
    setPeerId(null)
  }

  return (
    <main className="w-full rounded-md border-2 shadow-md">
      <section className="w-full flex flex-col p-8">
        {peerId ? (
          <div className="w-full flex items-center justify-between">
            <p><strong>Your ID:</strong> {peerId}</p>
            <div className="flex items-center space-x-2">
              <CopyButton peerId={peerId} />
              {peerId && <Button variant="destructive" onClick={destroyPeer}>Stop</Button>}
            </div>
          </div>
        ) : (
          <>
            <p>Start to get your peer id</p>
            <Separator className="mb-4" />
            <Button className="w-20" disabled={isLoadingStart} onClick={createPeer}>
              {isLoadingStart ? "Starting..." : "Start"}
            </Button>
          </>
        )}
      </section>
      {peerId && (
        <ConnectPeer connection={connection} setConnection={setConnection} />
      )
      }
      <IncomingFileDialog data={incomingData} open={isAlertDialogOpen} setOpen={setIsAlertDialogOpen} />
    </main>
  )
}
