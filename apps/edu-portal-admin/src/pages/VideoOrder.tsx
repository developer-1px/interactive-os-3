import { useState } from 'react'
import { videos } from '../entities/data'

export function VideoOrder() {
  const [order, setOrder] = useState(videos.map((v) => v.id))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= order.length) return
    setOrder((cur) => {
      const next = [...cur]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }
  return (
    <section aria-labelledby="vo-h" className="flex flex-col gap-3">
      <h2 id="vo-h" className="text-lg font-semibold text-neutral-900">비디오 정렬</h2>
      <ol className="m-0 flex list-none flex-col gap-1 p-0">
        {order.map((id, i) => {
          const v = videos.find((x) => x.id === id)
          if (!v) return null
          return (
            <li key={id} className="flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2">
              <span className="w-6 text-right text-xs text-neutral-400">{i + 1}</span>
              <span className="flex-1 text-sm text-neutral-900">{v.title}</span>
              <button
                type="button"
                aria-label="위로"
                onClick={() => move(i, -1)}
                className="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
              >↑</button>
              <button
                type="button"
                aria-label="아래로"
                onClick={() => move(i, 1)}
                className="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
              >↓</button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
