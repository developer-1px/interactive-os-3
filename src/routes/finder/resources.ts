import { defineResource, writeResource } from '../../ds'
import { router } from '../../router'
import {
  loadText,
  getImageUrl,
  smartItems,
  isSmartPath,
  getTree,
  subscribeTree,
} from './data'
import { highlightCode } from './highlight'
import type { FsNode, ViewMode, SmartGroupId } from './types'

/** Finder의 모든 데이터는 이 모듈의 Resource 정의를 통해서만 노출된다.
 *  컴포넌트는 useResource(...) 단일 인터페이스로만 read/write.
 *  data.ts의 currentTree/loadText/imageUrls 등은 이 파일이 흡수하여 위로 노출하지 않는다. */

export const treeResource = defineResource<FsNode>({
  key: () => 'finder/tree',
  initial: () => getTree(),
  subscribe: (_k, notify) =>
    subscribeTree(() => {
      writeResource(treeResource, getTree())
      notify()
    }),
})

export const viewResource = defineResource<ViewMode>({
  key: () => 'finder/view',
  initial: 'columns',
})

export const pinnedRootResource = defineResource<string>({
  key: () => 'finder/pinnedRoot',
  initial: '/',
})

/** path는 URL이 진실 원천. dispatch({type:'set'})는 router로 위임,
 *  URL → store 역방향은 Finder.tsx의 bridge effect 1회로 채운다. */
export const pathResource = defineResource<string>({
  key: () => 'finder/path',
  initial: '/',
  serialize: (_k, v) => {
    const splat = isSmartPath(v) ? v : v.replace(/^\//, '')
    void router.navigate({ to: '/finder/$', params: { _splat: splat } })
  },
})

export const textResource = defineResource<string | null, [string]>({
  key: (path) => `finder/text:${path}`,
  load: (path) => loadText(path),
})

export const imageResource = defineResource<string | null, [string]>({
  key: (path) => `finder/image:${path}`,
  load: (path) => getImageUrl(path) ?? null,
})

export const smartResource = defineResource<FsNode[], [SmartGroupId]>({
  key: (id) => `finder/smart:${id}`,
  load: (id) => smartItems(id),
})

export const codeHtmlResource = defineResource<string | null, [string, string]>({
  key: (path, lang) => `finder/code-html:${path}:${lang}`,
  load: async (path, lang) => {
    const text = await loadText(path)
    if (text == null) return null
    return highlightCode(text, lang)
  },
})

export const markdownHtmlResource = defineResource<string | null, [string]>({
  key: (path) => `finder/md-html:${path}`,
  load: async (path) => {
    const text = await loadText(path)
    if (text == null) return null
    return renderMarkdown(text)
  },
})

async function renderMarkdown(src: string): Promise<string> {
  const { marked } = await import('marked')
  const renderer = new marked.Renderer()
  renderer.code = ({ text, lang }) => {
    const safeLang = lang || 'txt'
    return `<pre data-lang="${escapeAttr(safeLang)}"><code>${escapeHtml(text)}</code></pre>`
  }
  return marked.parse(src, { async: true, renderer })
}
function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
function escapeAttr(s: string): string {
  return s.replace(/["&<>]/g, (c) => ({ '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
