/**
 * Settings — 섹션 내비 + 폼 + danger zone.
 *
 * 갭: SettingRow (label + description + control 3단) 반복 패턴 — content widget 후보.
 *     DangerZone section emphasis 부재.
 */
import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../ds'

type SectionId = 'profile' | 'account' | 'notification' | 'billing' | 'danger'

export function Settings() {
  const [section, setSection] = useState<SectionId>('profile')
  const [name, setName] = useState('유용태')
  const [email, setEmail] = useState('developer.1px@gmail.com')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(false)
  const [notifDigest, setNotifDigest] = useState<'daily' | 'weekly' | 'off'>('weekly')
  const [plan] = useState<'pro' | 'team' | 'enterprise'>('pro')

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split' } },

      /* 좌 내비 */
      nav: { id: 'nav', data: { type: 'Column', flow: 'list', emphasis: 'sunk', width: 240 } },
      navTitle: { id: 'navTitle', data: { type: 'Text', variant: 'h3', content: '설정' } },
      ...Object.fromEntries((['profile','account','notification','billing','danger'] as const).map((s) => [
        `nav-${s}`, { id: `nav-${s}`, data: {
          type: 'Ui', component: 'ToolbarButton',
          props: { pressed: section === s, onClick: () => setSection(s), 'aria-label': label(s) },
          content: label(s),
        } },
      ])),

      /* 우 본문 (섹션별 form) */
      main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },
      h: { id: 'h', data: { type: 'Text', variant: 'h1', content: label(section) } },

      /* profile */
      profSec: { id: 'profSec', data: { type: 'Section', emphasis: 'raised', flow: 'form', hidden: section !== 'profile' } },
      pName: { id: 'pName', data: { type: 'Ui', component: 'Field' } },
      pNameL: { id: 'pNameL', data: { type: 'Ui', component: 'FieldLabel', content: '이름' } },
      pNameI: { id: 'pNameI', data: { type: 'Ui', component: 'Input', props: { value: name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value), 'aria-label': '이름' } } },
      pBio: { id: 'pBio', data: { type: 'Ui', component: 'Field' } },
      pBioL: { id: 'pBioL', data: { type: 'Ui', component: 'FieldLabel', content: '자기 소개' } },
      pBioI: { id: 'pBioI', data: { type: 'Ui', component: 'Textarea', props: { defaultValue: 'ds 개발자 · classless HTML+ARIA 주의자', rows: 3, 'aria-label': '자기 소개' } } },
      pBioD: { id: 'pBioD', data: { type: 'Ui', component: 'FieldDescription', content: '프로필에 공개적으로 표시됩니다.' } },

      /* account */
      accSec: { id: 'accSec', data: { type: 'Section', emphasis: 'raised', flow: 'form', hidden: section !== 'account' } },
      aEmail: { id: 'aEmail', data: { type: 'Ui', component: 'Field' } },
      aEmailL: { id: 'aEmailL', data: { type: 'Ui', component: 'FieldLabel', content: '이메일' } },
      aEmailI: { id: 'aEmailI', data: { type: 'Ui', component: 'Input', props: { type: 'email', value: email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), 'aria-label': '이메일' } } },
      aPwd: { id: 'aPwd', data: { type: 'Ui', component: 'Field' } },
      aPwdL: { id: 'aPwdL', data: { type: 'Ui', component: 'FieldLabel', content: '비밀번호' } },
      aPwdBtn: { id: 'aPwdBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('변경 링크 전송') }, content: '변경 링크 받기' } },

      /* notification */
      notSec: { id: 'notSec', data: { type: 'Section', emphasis: 'raised', flow: 'form', hidden: section !== 'notification' } },
      nE: { id: 'nE', data: { type: 'Row', flow: 'split' } },
      nEL: { id: 'nEL', data: { type: 'Column', flow: 'list', grow: true } },
      nELbl: { id: 'nELbl', data: { type: 'Text', variant: 'strong', content: '이메일 알림' } },
      nEDesc: { id: 'nEDesc', data: { type: 'Text', variant: 'small', content: '중요 업데이트와 초대 메일을 받습니다.' } },
      nESw: { id: 'nESw', data: { type: 'Ui', component: 'Switch', props: { checked: notifEmail, onChange: () => setNotifEmail((v) => !v), 'aria-label': '이메일 알림' } } },

      nP: { id: 'nP', data: { type: 'Row', flow: 'split' } },
      nPL: { id: 'nPL', data: { type: 'Column', flow: 'list', grow: true } },
      nPLbl: { id: 'nPLbl', data: { type: 'Text', variant: 'strong', content: '푸시 알림' } },
      nPDesc: { id: 'nPDesc', data: { type: 'Text', variant: 'small', content: '실시간 이벤트를 데스크톱에서 받습니다.' } },
      nPSw: { id: 'nPSw', data: { type: 'Ui', component: 'Switch', props: { checked: notifPush, onChange: () => setNotifPush((v) => !v), 'aria-label': '푸시 알림' } } },

      nD: { id: 'nD', data: { type: 'Ui', component: 'Field' } },
      nDL: { id: 'nDL', data: { type: 'Ui', component: 'FieldLabel', content: '다이제스트' } },
      nDI: { id: 'nDI', data: {
        type: 'Ui', component: 'Select',
        props: { value: notifDigest, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setNotifDigest(e.target.value as 'daily' | 'weekly' | 'off'), 'aria-label': '다이제스트 빈도' },
        content: <>
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="off">받지 않음</option>
        </>,
      } },

      /* billing */
      billSec: { id: 'billSec', data: { type: 'Section', emphasis: 'raised', flow: 'form', hidden: section !== 'billing' } },
      bP: { id: 'bP', data: { type: 'Row', flow: 'split' } },
      bPL: { id: 'bPL', data: { type: 'Column', flow: 'list', grow: true } },
      bPLbl: { id: 'bPLbl', data: { type: 'Text', variant: 'strong', content: `현재 플랜: ${plan.toUpperCase()}` } },
      bPDesc: { id: 'bPDesc', data: { type: 'Text', variant: 'small', content: '월 $29 · 다음 결제일 2026-05-15' } },
      bPBtn: { id: 'bPBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('플랜 변경') }, content: '플랜 변경' } },
      bInv: { id: 'bInv', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('청구 내역') }, content: '청구 내역 보기' } },

      /* danger zone */
      dngSec: { id: 'dngSec', data: { type: 'Section', emphasis: 'callout', flow: 'form', hidden: section !== 'danger' } },
      dT: { id: 'dT', data: { type: 'Text', variant: 'h3', content: '⚠ 위험 구역' } },
      dExport: { id: 'dExport', data: { type: 'Row', flow: 'split' } },
      dExportL: { id: 'dExportL', data: { type: 'Column', flow: 'list', grow: true } },
      dExportTitle: { id: 'dExportTitle', data: { type: 'Text', variant: 'strong', content: '데이터 내보내기' } },
      dExportDesc: { id: 'dExportDesc', data: { type: 'Text', variant: 'small', content: '전체 계정 데이터를 JSON으로 다운로드합니다.' } },
      dExportBtn: { id: 'dExportBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('내보내기') }, content: '내보내기' } },

      dDel: { id: 'dDel', data: { type: 'Row', flow: 'split' } },
      dDelL: { id: 'dDelL', data: { type: 'Column', flow: 'list', grow: true } },
      dDelTitle: { id: 'dDelTitle', data: { type: 'Text', variant: 'strong', content: '계정 삭제' } },
      dDelDesc: { id: 'dDelDesc', data: { type: 'Text', variant: 'small', content: '이 작업은 되돌릴 수 없습니다. 모든 데이터가 즉시 제거됩니다.' } },
      dDelBtn: { id: 'dDelBtn', data: {
        type: 'Ui', component: 'Button',
        props: { onClick: () => window.confirm('정말 삭제하시겠습니까?') && alert('삭제'), style: { background: 'var(--ds-tone-danger)', color: '#fff' } },
        content: '계정 삭제',
      } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['nav', 'main'],

      nav: ['navTitle', ...(['profile','account','notification','billing','danger'] as const).map((s) => `nav-${s}`)],

      main: ['h', 'profSec', 'accSec', 'notSec', 'billSec', 'dngSec'],

      profSec: ['pName', 'pBio'],
      pName: ['pNameL', 'pNameI'],
      pBio: ['pBioL', 'pBioI', 'pBioD'],

      accSec: ['aEmail', 'aPwd'],
      aEmail: ['aEmailL', 'aEmailI'],
      aPwd: ['aPwdL', 'aPwdBtn'],

      notSec: ['nE', 'nP', 'nD'],
      nE: ['nEL', 'nESw'],
      nEL: ['nELbl', 'nEDesc'],
      nP: ['nPL', 'nPSw'],
      nPL: ['nPLbl', 'nPDesc'],
      nD: ['nDL', 'nDI'],

      billSec: ['bP', 'bInv'],
      bP: ['bPL', 'bPBtn'],
      bPL: ['bPLbl', 'bPDesc'],

      dngSec: ['dT', 'dExport', 'dDel'],
      dExport: ['dExportL', 'dExportBtn'],
      dExportL: ['dExportTitle', 'dExportDesc'],
      dDel: ['dDelL', 'dDelBtn'],
      dDelL: ['dDelTitle', 'dDelDesc'],
    },
  }
  return <Renderer page={definePage(data)} />
}

function label(s: SectionId): string {
  return s === 'profile' ? '프로필' : s === 'account' ? '계정' : s === 'notification' ? '알림' : s === 'billing' ? '결제' : '위험 구역'
}
