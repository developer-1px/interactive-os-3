import { TreeGrid, ColumnHeader, RowGroup, TreeRow, GridCell, activateProps } from '../../ds'
import { formatDate, formatSize } from './data'
import { extToIcon, type FsNode } from './types'

export function ListView({
  node,
  items,
  currentPath,
  onNavigate,
}: {
  node: FsNode | null
  items?: FsNode[]
  currentPath: string
  onNavigate: (path: string) => void
}) {
  const kids = items ?? node?.children ?? []
  return (
    <section data-part="list-view">
    <TreeGrid aria-label="목록뷰" aria-rowcount={kids.length} data-density="compact">
      <colgroup>
        <col data-col="name" />
        <col data-col="mtime" />
        <col data-col="size" />
        <col data-col="kind" />
      </colgroup>
      <thead>
        <tr>
          <ColumnHeader>이름</ColumnHeader>
          <ColumnHeader>수정일</ColumnHeader>
          <ColumnHeader>크기</ColumnHeader>
          <ColumnHeader>종류</ColumnHeader>
        </tr>
      </thead>
      <RowGroup>
        {kids.map((n, i) => {
          const selected = n.path === currentPath
          const kind = n.type === 'dir' ? '폴더' : (n.ext ?? '파일').toUpperCase()
          return (
            <TreeRow
              key={n.path}
              level={1}
              posinset={i + 1}
              setsize={kids.length}
              selected={selected}
              {...activateProps(() => onNavigate(n.path))}
            >
              <GridCell data-icon={n.type === 'dir' ? 'dir' : extToIcon(n.ext)}>
                <span>{n.name}</span>
              </GridCell>
              <GridCell>{formatDate(n.mtime)}</GridCell>
              <GridCell>{n.type === 'dir' ? '—' : formatSize(n.size)}</GridCell>
              <GridCell>{kind}</GridCell>
            </TreeRow>
          )
        })}
      </RowGroup>
    </TreeGrid>
    </section>
  )
}
