import { Josefin_Slab } from "next/font/google"

const josefinSlab = Josefin_Slab({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ['latin']
})

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-4">
      <h1 className="text-xl font-semibold flex">
        <div className={`flex flex-row items-center gap-[2px] text-xl ${josefinSlab.className}`}>
          <div className="w-6 h-6 bg-[#FF4F4F] flex items-center justify-center rounded-sm">
            <span className="text-white">
              e
            </span>
          </div>
          <div className="w-6 h-6 bg-[#3487FF] flex items-center justify-center rounded-sm">
            <span className="text-white">
              m
            </span>
          </div>
          <div className="w-6 h-6 bg-[#4DC65C] flex items-center justify-center rounded-sm">
            <span className="text-white">
              i
            </span>
          </div>
          <div className="w-6 h-6 bg-[#F8D239] flex items-center justify-center rounded-sm">
            <span className="text-white">
              n
            </span>
          </div>
        </div>
        &apos;s file transfer
      </h1>
      <nav className="flex gap-4">
        <a href="https://www.github.com/emingbt/webrtc-file-transfer" className="font-semibold hover:underline">GitHub</a>
      </nav>
    </header>
  )
}