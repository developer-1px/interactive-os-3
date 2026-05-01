export type PageId =
  | 'dashboard'
  | 'video-list'
  | 'video-new'
  | 'role-category'
  | 'cert-category'
  | 'video-order'

export interface PageAction {
  /** 버튼 라벨. 없으면 액션 미노출. */
  label: string
  /** 이동 대상 PageId. */
  to: PageId
  /** lucide 아이콘 이름. */
  icon: string
}

export const PAGE_TITLES: Record<PageId, { title: string; sub: string; action?: PageAction }> = {
  'dashboard':      { title: '대시보드',       sub: '교육 포털 운영 현황' },
  'video-list':     { title: '영상 관리',      sub: '', action: { label: '영상 등록',     to: 'video-new',     icon: 'plus' } },
  'video-new':      { title: '영상 등록',      sub: '', action: { label: '목록으로',      to: 'video-list',    icon: 'arrow-left' } },
  'role-category':  { title: '역할 카테고리',  sub: '', action: { label: '카테고리 추가', to: 'role-category', icon: 'plus' } },
  'cert-category':  { title: '코스 카테고리',  sub: '', action: { label: '카테고리 추가', to: 'cert-category', icon: 'plus' } },
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
  { id: 'dashboard',     label: '대시보드',      icon: 'chart-column', section: '메인' },
  { id: 'video-list',    label: '영상 관리',     icon: 'video',   section: '콘텐츠', badge: 12 },
  { id: 'video-new',     label: '영상 등록',     icon: 'plus',    section: '콘텐츠' },
  { id: 'role-category', label: '역할 카테고리', icon: 'dir',     section: '설정' },
  { id: 'cert-category', label: '코스 카테고리', icon: 'award',   section: '설정' },
  { id: 'video-order',   label: '영상 순서 관리', icon: 'arrow-up-down', section: '설정' },
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
  {
    id: 'v4', title: 'NCP API·SDK 입문', duration: '00:45:00',
    tags: ['API', 'SDK'], level: '초급', roles: ['개발자'],
    enrolled: 142, completion: 88, rating: 4.6, status: '게시 중', visible: true,
    createdAt: '2026.03.04',
  },
  {
    id: 'v5', title: 'DevOps 자동화 패턴', duration: '01:10:00',
    tags: ['Pipeline', 'GitOps'], level: '중급', roles: ['개발자'],
    enrolled: 64, completion: 55, rating: 4.3, status: '게시 중', visible: true,
    createdAt: '2026.04.22',
  },
  {
    id: 'v6', title: '클라우드 인프라 설계 기초', duration: '00:55:00',
    tags: ['VPC', 'Subnet'], level: '초급', roles: ['엔지니어'],
    enrolled: 121, completion: 80, rating: 4.4, status: '게시 중', visible: true,
    createdAt: '2026.02.18',
  },
  {
    id: 'v7', title: '가상 서버 운영·모니터링', duration: '01:05:00',
    tags: ['Cloud Insight', 'Monitoring'], level: '중급', roles: ['엔지니어'],
    enrolled: 98, completion: 70, rating: 4.5, status: '게시 중', visible: true,
    createdAt: '2026.03.20',
  },
  {
    id: 'v8', title: 'IAM·접근 제어 실습', duration: '00:50:00',
    tags: ['IAM', 'Role'], level: '중급', roles: ['보안', '엔지니어'],
    enrolled: 71, completion: 60, rating: 4.1, status: '게시 중', visible: true,
    createdAt: '2026.04.10',
  },
  {
    id: 'v9', title: 'HyperCLOVA X 활용 입문', duration: '00:40:00',
    tags: ['HyperCLOVA', 'LLM'], level: '초급', roles: ['AI'],
    enrolled: 203, completion: 92, rating: 4.7, status: '게시 중', visible: true,
    createdAt: '2026.04.20',
  },
]

export interface RoleCategory {
  id: string
  name: string
  desc: string
  icon: string
  videoIds: string[]
  visible: boolean
}

export const roleCategories: RoleCategory[] = [
  { id: 'dev', name: '클라우드 개발자 과정', desc: 'NCP API·SDK·DevOps 도구를 활용한 클라우드 네이티브 개발', icon: 'code', videoIds: ['v4', 'v1', 'v5'], visible: true },
  { id: 'eng', name: '클라우드 엔지니어 과정', desc: '서버·네트워크·스토리지 구성 및 클라우드 인프라 운영 관리', icon: 'wrench', videoIds: ['v6', 'v7', 'v8'], visible: true },
  { id: 'sec', name: '클라우드 보안 과정', desc: 'NCP 보안 서비스 활용 및 클라우드 환경 보안 정책 수립', icon: 'shield', videoIds: ['v8', 'v2'], visible: false },
  { id: 'ai',  name: '생성형 AI 과정', desc: 'HyperCLOVA X 및 AI API를 활용한 생성형 AI 서비스 개발', icon: 'bot', videoIds: ['v9', 'v3'], visible: true },
]

export interface CertCategory {
  id: string
  name: string
  desc: string
  level: 'NCA' | 'NCP' | 'NCE' | 'ETC'
  videoIds: string[]
  visible: boolean
  locked: boolean
}

export const certCategories: CertCategory[] = [
  { id: 'nca', name: 'NCA', desc: 'NAVER Cloud Associate — 입문 과정', level: 'NCA', videoIds: ['v4', 'v6', 'v9'], visible: true, locked: true },
  { id: 'ncp', name: 'NCP', desc: 'NAVER Cloud Professional — 실무 과정', level: 'NCP', videoIds: ['v1', 'v5', 'v7', 'v8'], visible: true, locked: true },
  { id: 'nce', name: 'NCE', desc: 'NAVER Cloud Expert — 심화 과정', level: 'NCE', videoIds: ['v2', 'v3'], visible: true, locked: true },
]

export function videoCountOf(c: { videoIds: string[] }): number {
  return c.videoIds.length
}

// 카테고리 → Badge tone 매핑. VideoList·VideoOrder 가 같은 출처를 공유한다.
// 레벨은 난이도 척도 — "danger/success" 는 의미 오용이라 neutral 계열만 사용.
// 상태는 실제 운영 의미(게시/예약/비공개)라 semantic tone 사용 OK.
export type Tone = 'default' | 'info' | 'success' | 'warning' | 'danger'

export const LEVEL_TONE: Record<VideoRow['level'], Tone> = {
  '초급': 'default', '중급': 'default', '고급': 'info',
}

export const STATUS_TONE: Record<VideoRow['status'], Tone> = {
  '게시 중': 'success', '예약': 'info', '임시저장': 'default', '숨김': 'danger',
}

// change 문자열에서 ↑/↓ 글리프 제거 — 방향 시각은 changeDir prop + StatCard가 lucide
// trending-up/down 아이콘으로 렌더링한다. 숫자 앞 기호는 컨텐츠에 남길 수 있다(+3).
export const kpi = {
  totalVideos: { value: 12, sub: '게시 중 10 · 임시저장 2', change: '+3 이번 달' },
  enrolled:    { value: 312, sub: '이번 주 신규 수강자',   change: '24.3% 전주 대비' },
  completion:  { value: '68%', sub: '완료 212 / 신청 312', change: '5%p 전주 대비' },
  rating:      { value: 4.3, sub: '피드백 142건',         change: '0.1 전주 대비' },
  dropout:     { value: '27%', sub: '50% 미만 이탈 · 이번 주', change: '3%p 전주 대비' },
}
