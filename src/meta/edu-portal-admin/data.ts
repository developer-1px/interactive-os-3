export type PageId =
  | 'dashboard'
  | 'video-list'
  | 'video-new'
  | 'role-category'
  | 'cert-category'
  | 'video-order'

export const PAGE_TITLES: Record<PageId, { title: string; sub: string }> = {
  'dashboard':      { title: '대시보드',       sub: '교육 포털 운영 현황' },
  'video-list':     { title: '영상 관리',      sub: '' },
  'video-new':      { title: '영상 등록',      sub: '' },
  'role-category':  { title: '역할 카테고리',  sub: '' },
  'cert-category':  { title: '코스 카테고리',  sub: '' },
  'video-order':    { title: '영상 순서 관리', sub: '' },
}

export const PAGE_PATHS: Record<PageId, string> = {
  'dashboard':      '/edu-portal-admin/dashboard',
  'video-list':     '/edu-portal-admin/videos',
  'video-new':      '/edu-portal-admin/videos/new',
  'role-category':  '/edu-portal-admin/role-categories',
  'cert-category':  '/edu-portal-admin/course-categories',
  'video-order':    '/edu-portal-admin/video-order',
}

export function activePage(pathname: string): PageId {
  const match = (Object.entries(PAGE_PATHS) as [PageId, string][])
    .find(([, p]) => pathname === p || pathname.startsWith(p + '/'))
  return match?.[0] ?? 'dashboard'
}

export interface NavItem {
  id: PageId
  label: string
  icon?: string
  badge?: number
  section: '메인' | '콘텐츠' | '설정'
}

export const navItems: NavItem[] = [
  { id: 'dashboard',     label: '대시보드',      icon: 'chart',   section: '메인' },
  { id: 'video-list',    label: '영상 관리',     icon: 'video',   section: '콘텐츠', badge: 12 },
  { id: 'video-new',     label: '영상 등록',     icon: 'plus',    section: '콘텐츠' },
  { id: 'role-category', label: '역할 카테고리', icon: 'folder',  section: '설정' },
  { id: 'cert-category', label: '코스 카테고리', icon: 'medal',   section: '설정' },
  { id: 'video-order',   label: '영상 순서 관리', icon: 'sort',   section: '설정' },
]

export interface VideoRow {
  id: string
  title: string
  duration: string
  tags: string[]
  level: '초급' | '중급' | '고급'
  roles: string[]
  enrolled: number
  completion: number | null
  rating: number | null
  status: '게시 중' | '임시저장' | '숨김' | '예약'
  visible: boolean
  createdAt: string
}

export const videos: VideoRow[] = [
  {
    id: 'v1', title: 'NCP CI/CD 파이프라인 구축 실습', duration: '01:20:00',
    tags: ['SourceCommit', 'SourcePipeline'], level: '중급', roles: ['개발자'],
    enrolled: 87, completion: 71, rating: 4.5, status: '게시 중', visible: true,
    createdAt: '2026.04.18',
  },
  {
    id: 'v2', title: '클라우드 보안 취약점 진단 및 대응', duration: '01:55:00',
    tags: ['WAF', 'Network Firewall'], level: '고급', roles: ['보안'],
    enrolled: 54, completion: 48, rating: 4.2, status: '게시 중', visible: true,
    createdAt: '2026.04.15',
  },
  {
    id: 'v3', title: '생성형 AI 서비스 아키텍처 설계', duration: '01:45:00',
    tags: ['CLOVA', 'AI API'], level: '고급', roles: ['AI', '개발자'],
    enrolled: 0, completion: null, rating: null, status: '임시저장', visible: false,
    createdAt: '2026.04.21',
  },
]

export interface RoleCategory {
  id: string
  name: string
  desc: string
  icon: string
  videoCount: number
  visible: boolean
}

export const roleCategories: RoleCategory[] = [
  { id: 'dev', name: '클라우드 개발자 과정', desc: 'NCP API·SDK·DevOps 도구를 활용한 클라우드 네이티브 개발', icon: '💻', videoCount: 5, visible: true },
  { id: 'eng', name: '클라우드 엔지니어 과정', desc: '서버·네트워크·스토리지 구성 및 클라우드 인프라 운영 관리', icon: '🔧', videoCount: 6, visible: true },
  { id: 'sec', name: '클라우드 보안 과정', desc: 'NCP 보안 서비스 활용 및 클라우드 환경 보안 정책 수립', icon: '🛡', videoCount: 4, visible: false },
  { id: 'ai',  name: '생성형 AI 과정', desc: 'HyperCLOVA X 및 AI API를 활용한 생성형 AI 서비스 개발', icon: '🤖', videoCount: 4, visible: true },
]

export interface CertCategory {
  id: string
  name: string
  desc: string
  level: 'NCA' | 'NCP' | 'NCE' | 'ETC'
  videoCount: number
  visible: boolean
  locked: boolean
}

export const certCategories: CertCategory[] = [
  { id: 'nca', name: 'NCA', desc: 'NAVER Cloud Associate — 입문 과정', level: 'NCA', videoCount: 4, visible: true, locked: true },
  { id: 'ncp', name: 'NCP', desc: 'NAVER Cloud Professional — 실무 과정', level: 'NCP', videoCount: 5, visible: true, locked: true },
  { id: 'nce', name: 'NCE', desc: 'NAVER Cloud Expert — 심화 과정', level: 'NCE', videoCount: 3, visible: true, locked: true },
]

export const kpi = {
  totalVideos: { value: 12, sub: '게시 중 10 · 임시저장 2', change: '+3 이번 달' },
  enrolled:    { value: 312, sub: '이번 주 신규 수강자',   change: '↑ 24.3% 전주 대비' },
  completion:  { value: '68%', sub: '완료 212 / 신청 312', change: '↑ 5%p 전주 대비' },
  rating:      { value: 4.3, sub: '피드백 142건',         change: '↓ 0.1 전주 대비' },
  dropout:     { value: '27%', sub: '50% 미만 이탈 · 이번 주', change: '↑ 3%p 전주 대비' },
}
