import { useState } from 'react'
import { Copy, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CopyButton({ peerId }: { peerId: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(peerId)
          setCopied(true)
          toast("Copied to clipboard", {
            action: {
              label: <X className="w-4 h-4" />,
              onClick: () => toast.dismiss(),
            },
            duration: 1500,
          })
        } catch (error) {
          // Fallback for mobile browsers that block clipboard API
          const textArea = document.createElement("textarea")
          textArea.value = peerId
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)

          setCopied(true)
          toast("Copied to clipboard", {
            action: {
              label: <X className="w-4 h-4" />,
              onClick: () => toast.dismiss(),
            },
            duration: 1500,
          })
        }
      }}
      onBlur={() => setCopied(false)}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </Button>
  )
}