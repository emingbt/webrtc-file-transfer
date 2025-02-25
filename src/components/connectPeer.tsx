import React, { useState } from "react"
import type { DataConnection } from "peerjs"
import { peerService } from "@/lib/peerService"
import { toast } from "sonner"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function ConnectPeer({ connection, setConnection }: {
  connection: DataConnection | null,
  setConnection: React.Dispatch<React.SetStateAction<DataConnection | null>>
}) {
  const [isLoadingConnect, setIsLoadingConnect] = useState(false)
  const [remotePeerId, setRemotePeerId] = useState<string | null>(null)

  const connectToPeer = () => {
    console.log("Connecting to:", remotePeerId)
    if (!remotePeerId) return
    setIsLoadingConnect(true)

    const connection = peerService.connectToPeer(remotePeerId, (data) => {
      console.log("Received data:", data)
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

  return (
    connection ? (
      <>
        <section className="w-full flex flex-col p-8">
          <p>Connect to a peer</p>
          <Separator className="mb-4" />
          <div className="w-full flex items-center gap-4 space-x-2">
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
          <div className="w-full flex items-center gap-4 space-x-2">
            <Input id="file" type="file" />
            <Button onClick={sendFile}>Send</Button>
          </div>
        </section>
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