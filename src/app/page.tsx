"use client"

import type { DataConnection } from "peerjs"
import { useState } from "react"
import { peerService } from "@/lib/peerService"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Copy, X } from "lucide-react"
import { toast } from "sonner"

export default function Home() {
  const [peerId, setPeerId] = useState<string | null>(null)
  const [connection, setConnection] = useState<DataConnection | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const createPeer = () => {
    setIsLoadingStart(true)
    peerService.createPeer((id) => {
      setPeerId(id)
      setIsLoading(false)
    }, (conn) => {
      setConnection(conn)
    }, () => {
      setConnection(null)
    })
  }

  const destroyPeer = () => {
    peerService.destroyPeer()
    setPeerId(null)
  }

  return (
    <main className="w-full">
      <section className="w-full flex flex-col p-8 rounded-md border-2 shadow-md">
        {peerId ? (
          <div className="w-full flex items-center gap-2">
            <p>Your ID: {peerId}</p>
            <Button variant="outline" onClick={() => {
              navigator.clipboard.writeText(peerId)
              toast("Copied to clipboard", {
                action: {
                  label: <X className="w-4 h-4" />,
                  onClick: () => {
                    toast.dismiss()
                  }
                },
                duration: 1500
              })
            }}><Copy /></Button>
            {peerId && <Button variant="destructive" onClick={destroyPeer}>Stop</Button>}
          </div>
        ) : (
          <>
            <p>Start to get your peer id to connect with other peers</p>
            <Separator className="mb-4" />
            <Button className="w-20" disabled={isLoading} onClick={createPeer}>
              {isLoading ? "Starting..." : "Start"}
            </Button>
          </>
        )}
      </section>
    </main>
  )
}
