import { createFileRoute, Outlet } from '@tanstack/react-router'

/**
 * /canvas — layout route. Outlet 으로 children(/canvas, /canvas/essentials, /canvas/tokens, ...) 렌더.
 *
 * /canvas root 자체는 canvas.index.tsx 가 담당 (전체 zoom-pan overview).
 * 자식 layer 라우트들은 LayerPage 로 flat 렌더.
 */
export const Route = createFileRoute('/canvas')({
  component: () => <Outlet />,
})
