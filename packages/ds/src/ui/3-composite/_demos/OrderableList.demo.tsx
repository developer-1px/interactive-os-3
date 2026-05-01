import { OrderableList } from '../OrderableList'
export default () => (
  <OrderableList
    aria-label="Demo order"
    data={{
      entities: {
        __root__: { id: '__root__', data: {} },
        a: { id: 'a', data: { label: 'First' } },
        b: { id: 'b', data: { label: 'Second' } },
      },
      relationships: { __root__: ['a', 'b'] },
    }}
    onReorder={() => {}}
  />
)
