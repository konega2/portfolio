import { useEffect, useMemo, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const canInstall = useMemo(() => deferred !== null, [deferred])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!canInstall) return null

  return (
    <button
      className="cta focus-ring border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
      onClick={async () => {
        if (!deferred) return
        await deferred.prompt()
        await deferred.userChoice
        setDeferred(null)
      }}
      type="button"
    >
      Instalar
    </button>
  )
}
