export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-4">
      <h1 className="text-xl font-bold">File Transfer</h1>
      <nav className="flex gap-4">
        <a href="https://www.github.com/emingbt/webrtc-file-transfer" className="font-bold hover:underline">GitHub</a>
      </nav>
    </header>
  )
}