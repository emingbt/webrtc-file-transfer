export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-4">
      <h1 className="text-xl font-semibold flex">
        <p className="font-bold">
          <span className="text-blue-500">
            e
          </span>
          <span className="text-yellow-500">
            m
          </span>
          <span className="text-red-500">
            i
          </span>
          <span className="text-green-500">
            n
          </span>
        </p>
        's file transfer
      </h1>
      <nav className="flex gap-4">
        <a href="https://www.github.com/emingbt/webrtc-file-transfer" className="font-semibold hover:underline">GitHub</a>
      </nav>
    </header>
  )
}