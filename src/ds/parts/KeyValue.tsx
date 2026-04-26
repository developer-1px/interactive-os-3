import { Fragment, type ComponentPropsWithoutRef, type ReactNode } from 'react'

export type KeyValueItem = { key: ReactNode; value: ReactNode }

type KeyValueProps = Omit<ComponentPropsWithoutRef<'dl'>, 'children'> & {
  items: ReadonlyArray<KeyValueItem>
}

/**
 * KeyValue — <dl><dt><dd> 라벨-값 쌍 리스트.
 * 데이터 주도 (items prop). children JSX 조립 안 받음.
 */
export function KeyValue({ items, ...rest }: KeyValueProps) {
  return (
    <dl data-part="key-value" {...rest}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <dt>{item.key}</dt>
          <dd>{item.value}</dd>
        </Fragment>
      ))}
    </dl>
  )
}
