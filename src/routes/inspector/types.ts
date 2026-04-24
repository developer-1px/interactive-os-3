export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn'
export type StrokeStyle = 'solid' | 'dashed' | 'dotted'
export type ExportFormat = 'PNG' | 'JPG' | 'SVG' | 'PDF'

export type Selection = {
  name: string
  x: number; y: number; w: number; h: number; rotation: number
  layoutDir: 'horizontal' | 'vertical'
  gap: number
  padTop: number; padRight: number; padBottom: number; padLeft: number
  opacity: number; radius: number
  blend: BlendMode
  fill: string; strokeColor: string; strokeWidth: number; strokeStyle: StrokeStyle
  effects: { id: string; label: string; enabled: boolean }[]
  exports: { id: string; scale: number; format: ExportFormat }[]
}

export const initialSelection: Selection = {
  name: 'Rectangle',
  x: 120, y: 80, w: 320, h: 200, rotation: 0,
  layoutDir: 'horizontal', gap: 8,
  padTop: 12, padRight: 16, padBottom: 12, padLeft: 16,
  opacity: 100, radius: 8, blend: 'normal',
  fill: '#4F46E5', strokeColor: '#111827', strokeWidth: 1, strokeStyle: 'solid',
  effects: [
    { id: 'e1', label: 'Drop shadow', enabled: true },
    { id: 'e2', label: 'Layer blur', enabled: false },
  ],
  exports: [
    { id: 'x1', scale: 1, format: 'PNG' },
    { id: 'x2', scale: 2, format: 'PNG' },
  ],
}
