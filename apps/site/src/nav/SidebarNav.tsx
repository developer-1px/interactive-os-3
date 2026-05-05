/**
 * 공통 좌측 네비. SSOT = 각 route 의 `staticData.palette` (router.tsx 에서 타입 선언).
 * 새 라우터 추가 = 그 파일 안에 `staticData.palette` 만 채우면 자동 등장.
 */
import { useRef } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { collectPalette, paletteCategory, type PaletteEntry } from './palette'

export function SidebarNav() {
  const router = useRouter()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const closeOnMobile = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      detailsRef.current?.removeAttribute('open')
    }
  }
  const groups = new Map<string, PaletteEntry[]>()
  for (const e of collectPalette(router)) {
    const k = paletteCategory(e)
    const arr = groups.get(k) ?? []
    arr.push(e)
    groups.set(k, arr)
  }

  return (
    <nav
      aria-label="Site navigation"
      className="shrink-0 border-stone-200 bg-stone-50 text-sm border-b md:border-b-0 md:border-r md:h-screen md:w-56 md:overflow-y-auto"
    >
      <details
        ref={detailsRef}
        className="group flex flex-col gap-4 p-3 md:!block"
        open
      >
        <summary className="cursor-pointer list-none rounded px-2 py-1 font-semibold text-stone-900 marker:hidden hover:bg-stone-100 md:hidden">
          ☰ @p/headless
        </summary>
        <Link
          to="/"
          onClick={closeOnMobile}
          className="hidden rounded px-2 py-1 font-semibold text-stone-900 hover:bg-stone-100 md:block"
        >
          @p/headless
        </Link>
      {[...groups.entries()].map(([cat, list]) => (
        <div key={cat} className="flex flex-col gap-0.5">
          <h3 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            {cat}
          </h3>
          {list.map((e) => (
            <Link
              key={e.id}
              to={e.to as never}
              params={e.params as never}
              onClick={closeOnMobile}
              activeProps={{ className: 'bg-stone-900 text-white' }}
              className="block rounded px-2 py-1 text-stone-700 [&:not(.active)]:hover:bg-stone-100 [&.active]:bg-stone-900 [&.active]:text-white [&.active]:hover:bg-stone-800"
            >
              {e.label}
            </Link>
          ))}
        </div>
      ))}
      </details>
    </nav>
  )
}
