import { ROOT, type NormalizedData } from '../../../ds'
import { DIGEST_OPTS, SECTIONS, sectionLabel, splitRow, splitRowRels, type Digest, type SectionId } from './data'

export interface SettingsState {
  section: SectionId; name: string; email: string
  notifEmail: boolean; notifPush: boolean; notifDigest: Digest
  setSection: (s: SectionId) => void; setName: (v: string) => void; setEmail: (v: string) => void
  setNotifEmail: (v: boolean) => void; setNotifPush: (v: boolean) => void; setNotifDigest: (v: Digest) => void
}

export function buildSettingsPage(s: SettingsState): NormalizedData {
  const hid = (id: SectionId) => s.section !== id
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split', roledescription: 'settings-page', label: 'Settings' } },
      nav: { id: 'nav', data: { type: 'Column', flow: 'list', emphasis: 'sunk', width: 240 } },
      navTitle: { id: 'navTitle', data: { type: 'Text', variant: 'h3', content: '설정' } },
      ...Object.fromEntries(SECTIONS.map(([id, label]) => [`nav-${id}`, { id: `nav-${id}`, data: {
        type: 'Ui', component: 'ToolbarButton',
        props: { pressed: s.section === id, onClick: () => s.setSection(id), 'aria-label': label },
        content: label,
      } }])),
      main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },
      h: { id: 'h', data: { type: 'Text', variant: 'h1', content: sectionLabel(s.section) } },

      profSec: { id: 'profSec', data: { type: 'Section', emphasis: 'raised', flow: 'form', hidden: hid('profile') } },
      pName: { id: 'pName', data: { type: 'Ui', component: 'Field' } },
      pNameL: { id: 'pNameL', data: { type: 'Ui', component: 'FieldLabel', content: '이름' } },
      pNameI: { id: 'pNameI', data: { type: 'Ui', component: 'Input', props: { value: s.name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => s.setName(e.target.value), 'aria-label': '이름' } } },

      accSec: { id: 'accSec', data: { type: 'Section', emphasis: 'raised', flow: 'form', hidden: hid('account') } },
      aEmail: { id: 'aEmail', data: { type: 'Ui', component: 'Field' } },
      aEmailL: { id: 'aEmailL', data: { type: 'Ui', component: 'FieldLabel', content: '이메일' } },
      aEmailI: { id: 'aEmailI', data: { type: 'Ui', component: 'Input', props: { type: 'email', value: s.email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => s.setEmail(e.target.value), 'aria-label': '이메일' } } },

      notSec: { id: 'notSec', data: { type: 'Section', emphasis: 'raised', flow: 'form', hidden: hid('notification') } },
      ...splitRow('nE', '이메일 알림', '중요 업데이트와 초대 메일'),
      nESw: { id: 'nESw', data: { type: 'Ui', component: 'Switch', props: { checked: s.notifEmail, onChange: () => s.setNotifEmail(!s.notifEmail), 'aria-label': '이메일 알림' } } },
      ...splitRow('nP', '푸시 알림', '실시간 이벤트'),
      nPSw: { id: 'nPSw', data: { type: 'Ui', component: 'Switch', props: { checked: s.notifPush, onChange: () => s.setNotifPush(!s.notifPush), 'aria-label': '푸시 알림' } } },
      nD: { id: 'nD', data: { type: 'Ui', component: 'Field' } },
      nDL: { id: 'nDL', data: { type: 'Ui', component: 'FieldLabel', content: '다이제스트' } },
      nDI: { id: 'nDI', data: { type: 'Ui', component: 'Select',
        props: { value: s.notifDigest, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => s.setNotifDigest(e.target.value as Digest), 'aria-label': '다이제스트' },
        content: <>{DIGEST_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</>,
      } },

      billSec: { id: 'billSec', data: { type: 'Section', emphasis: 'raised', flow: 'form', hidden: hid('billing') } },
      ...splitRow('bP', '현재 플랜: PRO', '월 $29 · 다음 결제일 2026-05-15'),
      bPBtn: { id: 'bPBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('플랜 변경') }, content: '플랜 변경' } },
      bInv: { id: 'bInv', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('청구 내역') }, content: '청구 내역 보기' } },

      dngSec: { id: 'dngSec', data: { type: 'Section', emphasis: 'callout', flow: 'form', hidden: hid('danger') } },
      dT: { id: 'dT', data: { type: 'Text', variant: 'h3', content: '⚠ 위험 구역' } },
      ...splitRow('dExport', '데이터 내보내기', '전체 계정 데이터를 JSON으로'),
      dExportBtn: { id: 'dExportBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('내보내기') }, content: '내보내기' } },
      ...splitRow('dDel', '계정 삭제', '이 작업은 되돌릴 수 없습니다'),
      dDelBtn: { id: 'dDelBtn', data: { type: 'Ui', component: 'Button',
        props: { onClick: () => window.confirm('정말 삭제?') && alert('삭제'), 'data-tone': 'danger' }, content: '계정 삭제' } },
    },
    relationships: {
      [ROOT]: ['page'], page: ['nav', 'main'],
      nav: ['navTitle', ...SECTIONS.map(([id]) => `nav-${id}`)],
      main: ['h', 'profSec', 'accSec', 'notSec', 'billSec', 'dngSec'],
      profSec: ['pName'], pName: ['pNameL', 'pNameI'],
      accSec: ['aEmail'], aEmail: ['aEmailL', 'aEmailI'],
      notSec: ['nE', 'nP', 'nD'],
      ...splitRowRels('nE', 'nESw'), ...splitRowRels('nP', 'nPSw'),
      nD: ['nDL', 'nDI'],
      billSec: ['bP', 'bInv'], ...splitRowRels('bP', 'bPBtn'),
      dngSec: ['dT', 'dExport', 'dDel'],
      ...splitRowRels('dExport', 'dExportBtn'), ...splitRowRels('dDel', 'dDelBtn'),
    },
  }
}
