import { useParams } from '@tanstack/react-router'
import { videos } from '../entities/data'

export function VideoEdit() {
  const { id } = useParams({ strict: false }) as { id?: string }
  const v = videos.find((x) => x.id === id)
  if (!v) return <p className="text-sm text-neutral-500">비디오를 찾을 수 없습니다.</p>
  return (
    <section aria-labelledby="ve-h" className="flex max-w-xl flex-col gap-4">
      <h2 id="ve-h" className="text-lg font-semibold text-neutral-900">비디오 수정 — {v.title}</h2>
      <form className="flex flex-col gap-3 rounded border border-neutral-200 bg-white p-4">
        <Field label="제목"><input defaultValue={v.title} className="rounded border border-neutral-200 px-2 py-1" /></Field>
        <Field label="레벨"><input defaultValue={v.level} className="rounded border border-neutral-200 px-2 py-1" /></Field>
        <Field label="러닝타임"><input defaultValue={v.duration} className="rounded border border-neutral-200 px-2 py-1" /></Field>
        <Field label="태그"><input defaultValue={v.tags.join(', ')} className="rounded border border-neutral-200 px-2 py-1" /></Field>
        <p className="text-xs text-neutral-500">데모 폼 — 제출 동작은 후속 마이그레이션</p>
      </form>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid grid-cols-[6rem_1fr] items-center gap-3 text-sm">
      <span className="text-neutral-700">{label}</span>
      {children}
    </label>
  )
}
