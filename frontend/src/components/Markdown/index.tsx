import { lazy, Suspense } from 'react'

const MarkdownLazy = lazy(() => import('./Markdown'));

export default function Markdown ({ children }: { children: string}) {
  return <Suspense fallback={null}>
    <MarkdownLazy>{children}</MarkdownLazy>
  </Suspense>
}
