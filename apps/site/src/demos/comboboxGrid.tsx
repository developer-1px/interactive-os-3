import { ROOT, fromTree } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { comboboxGridAxis, useComboboxGridPattern } from '@p/headless/patterns'
import { dedupe, probe } from '../catalog/keys'

export const meta = {
  title: 'Combobox · Grid Popup',
  apg: 'combobox',
  kind: 'collection' as const,
  blurb: 'Editable combobox whose popup is a grid — 2D arrows navigate cells, Enter commits the row.',
  keys: () => dedupe(probe(comboboxGridAxis())),
}

interface Row {
  id: string
  label: string
  children: { id: string; label: string }[]
}

const ROWS: Row[] = [
  { id: 'r1', label: 'Argentina · ARS · Buenos Aires', children: [
    { id: 'r1c1', label: 'Argentina' }, { id: 'r1c2', label: 'ARS' }, { id: 'r1c3', label: 'Buenos Aires' },
  ] },
  { id: 'r2', label: 'Australia · AUD · Canberra', children: [
    { id: 'r2c1', label: 'Australia' }, { id: 'r2c2', label: 'AUD' }, { id: 'r2c3', label: 'Canberra' },
  ] },
  { id: 'r3', label: 'Brazil · BRL · Brasília', children: [
    { id: 'r3c1', label: 'Brazil' }, { id: 'r3c2', label: 'BRL' }, { id: 'r3c3', label: 'Brasília' },
  ] },
  { id: 'r4', label: 'Canada · CAD · Ottawa', children: [
    { id: 'r4c1', label: 'Canada' }, { id: 'r4c2', label: 'CAD' }, { id: 'r4c3', label: 'Ottawa' },
  ] },
  { id: 'r5', label: 'Denmark · DKK · Copenhagen', children: [
    { id: 'r5c1', label: 'Denmark' }, { id: 'r5c2', label: 'DKK' }, { id: 'r5c3', label: 'Copenhagen' },
  ] },
  { id: 'r6', label: 'Japan · JPY · Tokyo', children: [
    { id: 'r6c1', label: 'Japan' }, { id: 'r6c2', label: 'JPY' }, { id: 'r6c3', label: 'Tokyo' },
  ] },
]

export default function Demo() {
  const [data, onEvent] = useLocalData(() => fromTree(ROWS))
  const { comboboxProps, gridProps, rowProps, cellProps, rows } = useComboboxGridPattern(
    data,
    onEvent,
    { label: 'Country', popupLabel: 'Country options' },
  )
  const expanded = Boolean(data.meta?.open?.includes(ROOT))

  return (
    <div className="relative w-96">
      <input
        {...comboboxProps}
        placeholder="Search country, currency, or capital…"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
      />
      {expanded && rows.length > 0 && (
        <div
          {...gridProps}
          className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-stone-200 bg-white p-1 text-sm shadow-lg"
        >
          {rows.map((row) => (
            <div
              key={row.id}
              {...rowProps(row.id)}
              className="grid grid-cols-[1fr_4rem_1fr] gap-2 rounded px-2 py-1"
            >
              {row.cells.map((cell) => (
                <span
                  key={cell.id}
                  {...cellProps(cell.id)}
                  className="cursor-pointer truncate data-[active]:bg-stone-200"
                >
                  {cell.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
