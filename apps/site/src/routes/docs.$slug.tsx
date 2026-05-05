import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useMemo } from 'react'
import { marked } from 'marked'

const sources = import.meta.glob<string>('../docs/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const DOCS_ORDER = ['getting-started', 'overview', 'core-concept', 'faq']

const DOCS = (() => {
  const out: { slug: string; title: string; raw: string }[] = []
  for (const [path, raw] of Object.entries(sources)) {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const title = (raw.match(/^#\s+(.+)$/m)?.[1] ?? slug).trim()
    out.push({ slug, title, raw })
  }
  return out.sort((a, b) => DOCS_ORDER.indexOf(a.slug) - DOCS_ORDER.indexOf(b.slug))
})()

export const Route = createFileRoute('/docs/$slug')({
  component: DocPage,
  staticData: {
    palette: {
      label: 'Docs',
      to: '/docs/$slug',
      params: { slug: 'getting-started' },
      category: 'Docs',
      sub: 'Getting Started · Overview · Core Concept',
    },
  },
  loader: ({ params }) => {
    const doc = DOCS.find((d) => d.slug === params.slug)
    if (!doc) throw notFound()
    return doc
  },
})

interface Heading { id: string; text: string; level: 2 | 3 }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function DocPage() {
  const doc = Route.useLoaderData()

  const { html, headings } = useMemo(() => {
    const headings: Heading[] = []
    const renderer = new marked.Renderer()
    renderer.heading = ({ text, depth }) => {
      const id = slugify(text)
      if (depth === 2 || depth === 3) headings.push({ id, text, level: depth })
      return `<h${depth} id="${id}"><a class="anchor" href="#${id}">#</a>${text}</h${depth}>`
    }
    renderer.code = ({ text, lang }) => {
      const safe = text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
      return `<pre data-lang="${lang ?? ''}"><code>${safe}</code></pre>`
    }
    const html = marked.parse(doc.raw, { async: false, renderer }) as string
    return { html, headings }
  }, [doc])

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-[220px_minmax(0,1fr)_220px] gap-8 px-8 py-10">
        <DocsNav active={doc.slug} />
        <article className="prose-doc min-w-0" dangerouslySetInnerHTML={{ __html: html }} />
        <PageToc headings={headings} />
      </div>
    </div>
  )
}

function DocsNav({ active }: { active: string }) {
  return (
    <nav aria-label="Docs index" className="sticky top-10 self-start text-sm">
      <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
        Documentation
      </h2>
      <ul className="space-y-0.5">
        {DOCS.map((d) => {
          const isActive = d.slug === active
          return (
            <li key={d.slug}>
              <Link
                to="/docs/$slug"
                params={{ slug: d.slug }}
                className={`block rounded px-2 py-1.5 ${
                  isActive ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {d.title}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="mt-6 border-t border-stone-200 pt-4">
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
          Reference
        </h3>
        <ul className="space-y-0.5">
          <li><Link to="/patterns" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">Patterns</Link></li>
          <li><Link to="/wrappers" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">Wrappers</Link></li>
          <li><Link to="/axes" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">Axes</Link></li>
          <li><Link to="/matrix" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">Matrix</Link></li>
          <li><Link to="/data" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">Data</Link></li>
          <li><Link to="/uievents" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">UiEvents</Link></li>
        </ul>
      </div>
      <div className="mt-6 border-t border-stone-200 pt-4">
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
          For LLMs
        </h3>
        <ul className="space-y-0.5">
          <li><a href="/llms.txt" className="block rounded px-2 py-1.5 font-mono text-xs text-stone-700 hover:bg-stone-100">/llms.txt</a></li>
          <li><a href="/llms-full.txt" className="block rounded px-2 py-1.5 font-mono text-xs text-stone-700 hover:bg-stone-100">/llms-full.txt</a></li>
        </ul>
      </div>
    </nav>
  )
}

function PageToc({ headings }: { headings: Heading[] }) {
  if (!headings.length) return <div />
  return (
    <nav aria-label="On this page" className="sticky top-10 self-start text-sm">
      <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
        On this page
      </h2>
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${h.id}`}
              className="block rounded px-2 py-1 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
