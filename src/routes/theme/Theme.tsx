/**
 * Theme Creator — 토큰 튜닝 도구이자 DS의 자기검증 거울.
 *
 * FlatLayout 셸 + ThemeCreatorBody Ui leaf. 슬라이더·palette 시각화·sample card 는
 * 라우트 전용 시각화 묶음이라 단일 Ui leaf 로 둔다 (G2 — 추후 공용 부품으로 정련).
 */
import { useMemo } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import { ThemeCreatorBody } from './ThemeCreatorBody'

export function ThemeCreator() {
  const page: NormalizedData = useMemo(() => definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      body: { id: 'body', data: { type: 'Ui', component: 'ThemeCreatorBody' } },
    },
    relationships: { [ROOT]: ['body'] },
  }), [])
  return <Renderer page={page} localRegistry={{ ThemeCreatorBody }} />
}
