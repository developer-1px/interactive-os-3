export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'default'
export type ChangeDir = 'up' | 'down'

export const kpis: Array<{ id: string; label: string; value: string; change: string; dir: ChangeDir; icon: string; variant?: 'danger' }> = [
  { id: 'rev',   label: '매출',       value: '$128,430', change: '+12.4%', dir: 'up',   icon: 'dollar' },
  { id: 'usr',   label: '활성 사용자', value: '42,180',  change:  '+8.1%', dir: 'up',   icon: 'users'  },
  { id: 'conv',  label: '전환율',      value: '4.82%',   change:  '-0.3%', dir: 'down', icon: 'chart'  },
  { id: 'churn', label: '이탈률',      value: '2.14%',   change:  '+0.1%', dir: 'up',   icon: 'alert', variant: 'danger' },
]

export const weekBars: Array<{ label: string; value: number; pct: number; variant: Tone }> = [
  { label: '월', value: 420, pct: 70,  variant: 'info' }, { label: '화', value: 380, pct: 63, variant: 'info' },
  { label: '수', value: 520, pct: 87,  variant: 'info' }, { label: '목', value: 600, pct: 100, variant: 'success' },
  { label: '금', value: 480, pct: 80,  variant: 'info' }, { label: '토', value: 210, pct: 35, variant: 'default' },
  { label: '일', value: 180, pct: 30,  variant: 'default' },
]

export const regionBars: Array<{ label: string; value: number; pct: number; variant: Tone }> = [
  { label: '서울', value: 18200, pct: 100, variant: 'info' },
  { label: '부산', value: 6400,  pct: 35,  variant: 'info' },
  { label: '대구', value: 3800,  pct: 21,  variant: 'info' },
  { label: '인천', value: 3200,  pct: 18,  variant: 'default' },
  { label: '기타', value: 10580, pct: 58,  variant: 'success' },
]

export const sources = [
  { label: 'Organic',  count: '18,420 (44%)' }, { label: 'Direct',   count: '12,080 (29%)' },
  { label: 'Paid',     count:  '6,280 (15%)' }, { label: 'Referral', count:  '3,400 (8%)'  },
  { label: 'Social',   count:  '1,700 (4%)'  },
]

export const RANGES = ['7d','30d','90d','custom'] as const
export type Range = typeof RANGES[number]
