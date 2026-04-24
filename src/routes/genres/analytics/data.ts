export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral'
export type ChangeDir = 'up' | 'down'

export const kpis: Array<{ id: string; label: string; value: string; change: string; dir: ChangeDir; icon: string; tone?: 'alert' }> = [
  { id: 'rev',   label: '매출',       value: '$128,430', change: '+12.4%', dir: 'up',   icon: 'dollar' },
  { id: 'usr',   label: '활성 사용자', value: '42,180',  change:  '+8.1%', dir: 'up',   icon: 'users'  },
  { id: 'conv',  label: '전환율',      value: '4.82%',   change:  '-0.3%', dir: 'down', icon: 'chart'  },
  { id: 'churn', label: '이탈률',      value: '2.14%',   change:  '+0.1%', dir: 'up',   icon: 'alert', tone: 'alert' },
]

export const weekBars: Array<{ label: string; value: number; pct: number; tone: Tone }> = [
  { label: '월', value: 420, pct: 70,  tone: 'info' }, { label: '화', value: 380, pct: 63, tone: 'info' },
  { label: '수', value: 520, pct: 87,  tone: 'info' }, { label: '목', value: 600, pct: 100, tone: 'success' },
  { label: '금', value: 480, pct: 80,  tone: 'info' }, { label: '토', value: 210, pct: 35, tone: 'neutral' },
  { label: '일', value: 180, pct: 30,  tone: 'neutral' },
]

export const regionBars: Array<{ label: string; value: number; pct: number; tone: Tone }> = [
  { label: '서울', value: 18200, pct: 100, tone: 'info' },
  { label: '부산', value: 6400,  pct: 35,  tone: 'info' },
  { label: '대구', value: 3800,  pct: 21,  tone: 'info' },
  { label: '인천', value: 3200,  pct: 18,  tone: 'neutral' },
  { label: '기타', value: 10580, pct: 58,  tone: 'success' },
]

export const sources = [
  { label: 'Organic',  count: '18,420 (44%)' }, { label: 'Direct',   count: '12,080 (29%)' },
  { label: 'Paid',     count:  '6,280 (15%)' }, { label: 'Referral', count:  '3,400 (8%)'  },
  { label: 'Social',   count:  '1,700 (4%)'  },
]

export const RANGES = ['7d','30d','90d','custom'] as const
export type Range = typeof RANGES[number]
