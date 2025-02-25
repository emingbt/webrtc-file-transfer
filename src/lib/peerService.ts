import { IncomingData } from "@/interface"
import Peer, { DataConnection } from "peerjs"

class PeerService {
  private peer: Peer | null = null
  private connection: DataConnection | null = null

  createPeer(
    onOpen: (id: string) => void,
    onConnection: (conn: DataConnection) => void,
    onData?: (data: IncomingData) => void,
    onConnectionClose?: () => void
  ) {
    if (this.peer) return // Prevent multiple instances

    this.peer = new Peer()

    this.peer.on("open", (id) => {
      console.log("Peer ID:", id)
      onOpen(id) // Notify component that peer is ready
    })

    this.peer.on("connection", (conn) => {
      console.log("New connection:", conn)
      onConnection(conn)

      conn.on("data", (data) => {
        console.log("Received data:", data)
        if (onData) onData(data as IncomingData)
      })

      conn.on("close", () => {
        console.log("Connection closed")
        if (onConnectionClose) onConnectionClose()
      })
    })
  }

  destroyPeer() {
    if (this.peer) {
      this.peer.destroy()
      this.peer = null
      this.connection = null
      console.log("Peer destroyed")
    }
  }

  connectToPeer(
    remotePeerId: string,
    onData: (data: IncomingData) => void,
    onOpen?: () => void,
    onClose?: () => void,
    onTimeout?: () => void
  ) {
    if (!this.peer) {
      console.error("Peer instance not found. Refresh the page and try again.")
      return
    }

    const conn = this.peer.connect(remotePeerId)
    let isOpened = false

    const timeout = setTimeout(() => {
      if (!isOpened) {
        console.log("Connection timeout: Failed to connect within 5 seconds")
        conn.close()
        if (onTimeout) onTimeout()
      }
    }, 5000)

    conn.on("open", () => {
      this.connection = conn
      isOpened = true
      clearTimeout(timeout)
      console.log("Connected to:", remotePeerId)
      if (onOpen) onOpen() // Notify component that connection is open
    })

    conn.on("data", (data) => {
      console.log("Received data:", data)
      onData(data as IncomingData)
    })

    conn.on("close", () => {
      console.log("Connection closed")
      this.connection = null
      if (onClose) onClose() // Notify component that connection is closed
    })

    return conn
  }

  isConnected(): boolean {
    return this.connection?.open ?? false
  }
}

export const peerService = new PeerService()
