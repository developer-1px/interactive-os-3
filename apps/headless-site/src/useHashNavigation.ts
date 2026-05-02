import { useEffect, useState } from 'react'

/**
 * useHashNavigation — listens to `hashchange` and the initial mount, scrolling
 * the matching `#<slug>` section into view. Returns the active slug for
 * downstream "is current" UI cues.
 */
export function useHashNavigation() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1))

  useEffect(() => {
    const handle = () => {
      const next = window.location.hash.slice(1)
      setHash(next)
      const target = next ? document.getElementById(next) : document.getElementById('intro')
      target?.scrollIntoView({ behavior: 'instant' })
      if (next) target?.focus({ preventScroll: true })
    }
    handle()
    window.addEventListener('hashchange', handle)
    return () => window.removeEventListener('hashchange', handle)
  }, [])

  return hash
}
