import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type FeedArticleProps = ComponentPropsWithoutRef<'article'> & {
  posinset?: number
  setsize?: number
  avatar?: ReactNode
  header?: ReactNode
  children: ReactNode
}

export function FeedArticle({
  posinset,
  setsize,
  avatar,
  header,
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
        {avatar}
        <div>
          {header && <header>{header}</header>}
          {children}
        </div>
      </article>
    </li>
  )
}
