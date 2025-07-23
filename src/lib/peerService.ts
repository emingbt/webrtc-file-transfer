import { IncomingData } from "@/interface"
import Peer, { DataConnection } from "peerjs"

class PeerService {
  private peer: Peer | null = null
  private connection: DataConnection | null = null

  createPeer(
    username: string,
    onOpen: (id: string) => void,
    onConnection: (conn: DataConnection) => void,
    onData?: (data: IncomingData) => void,
    onConnectionClose?: () => void
  ) {
    if (this.peer) return // Prevent multiple instances

    this.tryCreatePeerWithId(username, 0, onOpen, onConnection, onData, onConnectionClose)
  }

  private tryCreatePeerWithId(
    baseUsername: string,
    attempt: number,
    onOpen: (id: string) => void,
    onConnection: (conn: DataConnection) => void,
    onData?: (data: IncomingData) => void,
    onConnectionClose?: () => void
  ) {
    const currentId = attempt === 0 ? baseUsername : `${baseUsername}-${attempt}`

    this.peer = new Peer(currentId)

    this.peer.on("open", (id) => {
      onOpen(id) // Notify component that peer is ready
    })

    this.peer.on("connection", (conn) => {
      onConnection(conn)

      conn.on("data", (data) => {
        if (onData) onData(data as IncomingData)
      })

      conn.on("close", () => {
        if (onConnectionClose) onConnectionClose()
      })
    })

    this.peer.on("error", (error) => {
      console.log("Peer error:", error)

      // If the error is due to ID already taken, try with next increment
      if (error.type === 'unavailable-id' && attempt < 10) { // Limit attempts to prevent infinite loop
        this.peer?.destroy()
        this.peer = null
        setTimeout(() => {
          this.tryCreatePeerWithId(baseUsername, attempt + 1, onOpen, onConnection, onData, onConnectionClose)
        }, 100) // Small delay before retry
      }
    })

    this.peer.on("disconnected", () => {
      this.peer?.reconnect()
    })
  }

  destroyPeer() {
    if (this.peer) {
      this.peer.destroy()
      this.peer = null
      this.connection = null
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

    if (!conn) {
      console.error("Error connecting to user with id:", remotePeerId)
      return
    }

    let isOpened = false

    const timeout = setTimeout(() => {
      if (!isOpened) {
        conn.close()
        if (onTimeout) onTimeout()
      }
    }, 5000)

    conn.on("open", () => {
      this.connection = conn
      isOpened = true
      clearTimeout(timeout)
      if (onOpen) onOpen() // Notify component that connection is open
    })

    conn.on("data", (data) => {
      onData(data as IncomingData)
    })

    conn.on("close", () => {
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
