import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type FeedArticleProps = ComponentPropsWithoutRef<'article'> & {
  posinset?: number
  setsize?: number
  children: ReactNode
}

export function FeedArticle({
  posinset,
  setsize,
  children,
  ...rest
}: FeedArticleProps) {
  return (
    <li>
      <article
        tabIndex={0}
        aria-posinset={posinset}
        aria-setsize={setsize}
        {...rest}
      >
        {children}
      </article>
    </li>
  )
}
