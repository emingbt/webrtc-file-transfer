"use client"

import React, { useState } from "react"
import type { DataConnection } from "peerjs"
import type { IncomingData } from "@/interface"
import { peerService } from "@/lib/peerService"
import { toast } from "sonner"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import IncomingFileDialog from "./incomingFileDialog"

export default function ConnectPeer({ connection, setConnection }: {
  connection: DataConnection | null,
  setConnection: React.Dispatch<React.SetStateAction<DataConnection | null>>
}) {
  const [isLoadingConnect, setIsLoadingConnect] = useState(false)
  const [remotePeerId, setRemotePeerId] = useState<string | null>(null)
  const [incomingData, setIncomingData] = useState<IncomingData | null>(null)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [isFileSent, setIsFileSent] = useState(false)

  const connectToPeer = () => {
    console.log("Connecting to:", remotePeerId)
    if (!remotePeerId) return
    setIsLoadingConnect(true)

    const connection = peerService.connectToPeer(remotePeerId, (data) => {
      document.title = `Incoming File (1) | emin's file transfer`
      setIncomingData(data)
      setIsAlertDialogOpen(true)
    }, () => {
      console.log("Connection open")
      if (connection) setConnection(connection)
      setIsLoadingConnect(false)
    }, () => {
      console.log("Connection closed")
      setConnection(null)
    }, () => {
      console.log("Connection timeout: Failed to connect within 5 seconds")
      setIsLoadingConnect(false)
    }
    )

    console.log("Connection", connection)

    console.log("Is Connected:", peerService.isConnected())

    if (!connection) {
      toast(`Error connecting to user with id: ${remotePeerId}`, {
        action: {
          label: <X className="w-4 h-4" />,
          onClick: () => {
            toast.dismiss()
          }
        },
        duration: 3000
      })

      setIsLoadingConnect(false)
    }
  }

  const sendFile = () => {
    console.log("Sending file to peer")
    if (!connection) return

    const file = document.getElementById("file") as HTMLInputElement
    if (file.files && file.files.length > 0) {
      const fileData = file.files[0]
      connection?.send({
        name: fileData.name,
        type: fileData.type,
        size: fileData.size,
        file: fileData
      })
    }
  }

  return (
    connection ? (
      <>
        <section className="w-full flex flex-col p-8">
          <p>Connect to a peer</p>
          <Separator className="mb-4" />
          <div className="w-full flex items-center justify-between">
            <p><strong>Connected to:</strong> {connection.peer}</p>
            <Button variant="destructive" onClick={() => {
              connection.close()
              setConnection(null)
            }}>Disconnect</Button>
          </div>
        </section>
        <section className="w-full flex flex-col p-8">
          <p>Send a file to peer</p>
          <Separator className="mb-4" />
          <div className="w-full flex flex-col md:flex-row items-end md:items-center gap-4 space-x-2">
            <Input id="file" type="file" onChange={() => setIsFileSent(false)} />
            <Button disabled={isFileSent} onClick={() => {
              setIsFileSent(true)
              sendFile()
            }}
            >
              {isFileSent ? "Sent" : "Send"}
            </Button>
          </div>
        </section>
        <IncomingFileDialog data={incomingData} open={isAlertDialogOpen} setOpen={setIsAlertDialogOpen} />
      </>
    )
      :
      (
        <section className="w-full flex flex-col p-8">
          <p>Connect to a peer</p>
          <Separator className="mb-4" />
          <div className="w-full flex items-center gap-4 space-x-2">
            <Input placeholder="Peer ID" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setRemotePeerId(event.target.value)
            }} />
            <Button onClick={connectToPeer} disabled={isLoadingConnect}>
              {isLoadingConnect ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </section>
      )
  )
}