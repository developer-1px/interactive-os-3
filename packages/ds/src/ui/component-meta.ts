/**
 * Component meta — co-located SSOT.
 *
 * 컴포넌트의 atom/composed 정체성은 lane default 가 아니라 컴포넌트 자신이
 * 결정한다. lane 이 혼합(atom + composed 섞임)일 때 컴포넌트 옆 `Foo.meta.ts`
 * default export 로 lane default 를 override 한다.
 *
 * canvas 등 소비자는 `import.meta.glob('@p/ds/ui/* /*.meta.ts')` 로 자동 수집
 * — atom/composed 분류 변경 시 canvas 코드 수정 0곳.
 */
export type ComponentTier = 'atom' | 'composed'

export type ComponentMeta = {
  tier: ComponentTier
}

export function defineComponent(meta: ComponentMeta): ComponentMeta {
  return meta
}
