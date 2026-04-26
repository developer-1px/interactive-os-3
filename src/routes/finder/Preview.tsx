import { Link } from '@tanstack/react-router'
import { useResource } from '../../ds'
import { formatDate, formatSize } from './data'
import {
  textResource, imageResource, codeHtmlResource, markdownHtmlResource,
} from './resources'
import { extToIcon, extToLang, extToPreviewKind, type FsNode } from './types'
import type { PreviewVM } from './finder.feature'

/** PreviewPane — feature.view.preview 의 VM 을 받아 aside 마크업 + Meta 렌더.
 *  파일 본문은 PreviewBody 가 자기 fetch 로 처리. */
export function PreviewPane({ vm }: { vm: PreviewVM }) {
  const show = vm.kind !== 'empty'
  return (
    <aside data-part="preview" aria-label="미리보기" aria-hidden={!show}>
      {show && 'node' in vm && (
        <>
          {vm.kind === 'dir'
            ? <Header node={vm.node} note={`${vm.node.children?.length ?? 0}개 항목`} />
            : <PreviewBody node={vm.node} />}
          <Meta node={vm.node} />
        </>
      )}
    </aside>
  )
}

const MAX_TEXT_BYTES = 512 * 1024

export function PreviewBody({ node }: { node: FsNode }) {
  const kind = extToPreviewKind(node.ext)
  const tooLarge = (node.size ?? 0) > MAX_TEXT_BYTES

  if (kind === 'image') return <ImageView node={node} />
  if (kind === 'binary') return <Header node={node} note="미리보기를 지원하지 않는 형식" />
  if (tooLarge) return <Header node={node} note="파일이 커서 메타만 표시합니다" />

  if (kind === 'markdown') return <MarkdownView node={node} />
  if (kind === 'code') return <CodeView node={node} />
  return <TextView node={node} />
}

function Header({ node, note }: { node: FsNode; note?: string }) {
  const isDir = node.type === 'dir'
  const kind = isDir ? '폴더' : (node.ext ?? '파일').toUpperCase()
  const sub = isDir ? kind : `${kind} · ${formatSize(node.size)}`
  return (
    <header>
      <figure data-icon={isDir ? 'dir' : extToIcon(node.ext)} aria-hidden />
      <hgroup>
        <h2>{node.name}</h2>
        <p>{note ?? sub}</p>
      </hgroup>
    </header>
  )
}

function Meta({ node }: { node: FsNode }) {
  const isDir = node.type === 'dir'
  return (
    <dl>
      <dt>종류</dt><dd>{isDir ? '폴더' : (node.ext || '파일')}</dd>
      <dt>경로</dt><dd title={node.path}>{node.path}</dd>
      {!isDir && node.size != null && <><dt>크기</dt><dd>{formatSize(node.size)}</dd></>}
      {node.mtime && <><dt>수정일</dt><dd>{formatDate(node.mtime)}</dd></>}
    </dl>
  )
}

function ImageView({ node }: { node: FsNode }) {
  const [src] = useResource(imageResource, node.path)
  if (src === undefined) return <Header node={node} note="이미지 로딩 중…" />
  if (src === null) return <Header node={node} note="이미지를 찾을 수 없습니다" />
  return <img src={src} alt={node.name} />
}

function TextView({ node }: { node: FsNode }) {
  const [text] = useResource(textResource, node.path)
  if (text == null) return <pre aria-busy="true" />
  return <pre>{text}</pre>
}

function CodeView({ node }: { node: FsNode }) {
  const lang = extToLang(node.ext)
  const [text] = useResource(textResource, node.path)
  const [html] = useResource(codeHtmlResource, node.path, lang)
  if (text == null) return <pre aria-busy="true" />
  if (html == null) return <pre data-lang={lang}>{text}</pre>
  return <pre data-lang={lang} dangerouslySetInnerHTML={{ __html: html }} />
}

function MarkdownView({ node }: { node: FsNode }) {
  const [html] = useResource(markdownHtmlResource, node.path)
  if (html == null) return <article aria-busy="true" />
  return (
    <>
      <nav aria-label="마크다운 액션">
        <Link to="/markdown/$" params={{ _splat: node.path.replace(/^\//, '') }}>전체 화면으로 열기 ↗</Link>
      </nav>
      <article data-flow="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  )
}
