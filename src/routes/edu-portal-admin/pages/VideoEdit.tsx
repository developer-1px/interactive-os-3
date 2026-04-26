import { useState } from 'react'
import { Renderer, definePage, ROOT } from '../../../ds'

type NodeMap = Record<string, { id: string; data: Record<string, unknown> }>
type RelMap = Record<string, string[]>

export function VideoEdit() {
  const [roles, setRoles] = useState({ dev: true, eng: true, sec: false, ai: false })
  const [certs, setCerts] = useState({ nca: true, ncp: true, nce: false })
  const [tags, setTags] = useState(['Kubernetes', 'Container', 'Docker', 'NKS'])
  const [services, setServices] = useState(['NKS', 'Container Registry', 'Server'])
  const [tagInput, setTagInput] = useState('')
  const [visible, setVisible] = useState({ online: true, roleMain: true, certMain: true })

  const addTag = (list: string[], setter: (x: string[]) => void, value: string) => {
    const v = value.trim()
    if (v && !list.includes(v)) setter([...list, v])
  }
  const removeTag = (list: string[], setter: (x: string[]) => void, value: string) =>
    setter(list.filter((t) => t !== value))

  const entities: NodeMap = {
    [ROOT]: { id: ROOT, data: {} },
    form: { id: 'form', data: { type: 'Row', flow: 'form', label: '영상 편집' } },

    // — main column —
    main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },

    // upload section
    secUpload: { id: 'secUpload', data: { type: 'Section', heading: { content: '영상 파일' } } },
    uploadFile: { id: 'uploadFile', data: {
      type: 'Ui', component: 'Input',
      props: { type: 'file', accept: 'video/mp4,video/quicktime', 'aria-label': '영상 업로드' },
    } },
    uploadNote: { id: 'uploadNote', data: { type: 'Text', variant: 'small', content: 'MP4, MOV · 최대 10GB' } },
    uploadProgress: { id: 'uploadProgress', data: {
      type: 'Ui', component: 'Progress', props: { value: 0, 'aria-label': '업로드 진행률' },
    } },

    // basic info section
    secBasic: { id: 'secBasic', data: { type: 'Section', heading: { content: '기본 정보' } } },

    ...fieldNode('title', '영상 제목', true, {
      type: 'Ui', component: 'Input',
      props: { defaultValue: 'Kubernetes on NCP: 컨테이너 오케스트레이션' },
    }),
    ...fieldNode('level', '레벨', true, {
      type: 'Ui', component: 'Select',
      props: { defaultValue: '중급' },
      content: <><option>초급</option><option>중급</option><option>고급</option></>,
    }),
    ...fieldNode('duration', '재생 시간', false, {
      type: 'Ui', component: 'Input',
      props: { defaultValue: '02:10:00', readOnly: true },
    }, '파일 업로드 시 자동 입력'),

    // roles fieldset (native — Checkbox-as-role)
    rolesWrap: { id: 'rolesWrap', data: { type: 'Column', flow: 'form',
      label: '역할', roledescription: 'fieldset' } },
    rolesLegend: { id: 'rolesLegend', data: { type: 'Text', variant: 'strong', content: '역할 *' } },
    ...checkboxRows('role', roles, setRoles, {
      dev: '개발자', eng: '엔지니어', sec: '보안', ai: 'AI',
    }),

    certsWrap: { id: 'certsWrap', data: { type: 'Column', flow: 'form', label: '코스',
      roledescription: 'fieldset' } },
    certsLegend: { id: 'certsLegend', data: { type: 'Text', variant: 'strong',
      content: <>코스 <small>(기술자격증 연관 코스 선택)</small></> } },
    ...checkboxRows('cert', certs, setCerts, { nca: 'NCA', ncp: 'NCP', nce: 'NCE' }),
    certsNote: { id: 'certsNote', data: { type: 'Text', variant: 'small',
      content: '해당 자격증 준비에 도움이 되는 영상에 체크하세요.' } },

    // tag inputs
    tagsWrap: { id: 'tagsWrap', data: { type: 'Column', flow: 'form', label: '주요 키워드',
      roledescription: 'fieldset' } },
    tagsLegend: { id: 'tagsLegend', data: { type: 'Text', variant: 'strong', content: '주요 키워드' } },
    tagsList: { id: 'tagsList', data: { type: 'Row', flow: 'cluster', label: '키워드 태그' } },
    ...tagChipNodes('tag', tags, (t) => removeTag(tags, setTags, t)),
    tagInputEl: { id: 'tagInputEl', data: {
      type: 'Ui', component: 'Input',
      props: {
        value: tagInput,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value),
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addTag(tags, setTags, tagInput)
            setTagInput('')
          }
        },
        placeholder: '입력 후 Enter',
        'aria-label': '새 키워드 태그',
      },
    } },
    tagsHint: { id: 'tagsHint', data: { type: 'Text', variant: 'small', content: 'Enter로 태그 추가' } },

    servicesWrap: { id: 'servicesWrap', data: { type: 'Column', flow: 'form', label: '다루는 서비스',
      roledescription: 'fieldset' } },
    servicesLegend: { id: 'servicesLegend', data: { type: 'Text', variant: 'strong', content: '다루는 서비스' } },
    servicesList: { id: 'servicesList', data: { type: 'Row', flow: 'cluster', label: '서비스 태그' } },
    ...tagChipNodes('svc', services, (t) => removeTag(services, setServices, t)),

    ...fieldNode('desc', '영상 소개', true, {
      type: 'Ui', component: 'Textarea',
      props: { rows: 4, defaultValue: 'NCP Kubernetes Service(NKS)를 활용하여 컨테이너 기반 애플리케이션을 배포하고 운영하는 방법을 학습합니다.' },
    }),

    // media
    secMedia: { id: 'secMedia', data: { type: 'Section', heading: { content: '미디어 및 첨부파일' } } },
    thumbLabel: { id: 'thumbLabel', data: { type: 'Text', variant: 'strong', content: '썸네일 이미지' } },
    thumbFile: { id: 'thumbFile', data: {
      type: 'Ui', component: 'Input',
      props: { type: 'file', accept: 'image/*', 'aria-label': '썸네일 이미지' },
    } },
    thumbNote: { id: 'thumbNote', data: { type: 'Text', variant: 'small', content: 'JPG, PNG · 권장 1280×720px' } },
    docsLabel: { id: 'docsLabel', data: { type: 'Text', variant: 'strong', content: '관련 문서' } },
    docsFile: { id: 'docsFile', data: {
      type: 'Ui', component: 'Input',
      props: { type: 'file', multiple: true, 'aria-label': '관련 문서' },
    } },
    docsNote: { id: 'docsNote', data: { type: 'Text', variant: 'small', content: 'PDF, PPT, ZIP — 복수 업로드 가능' } },

    urlWrap: { id: 'urlWrap', data: { type: 'Column', flow: 'form', label: '관련 URL',
      roledescription: 'fieldset' } },
    urlLegend: { id: 'urlLegend', data: { type: 'Text', variant: 'strong', content: '관련 URL' } },
    urlName: { id: 'urlName', data: {
      type: 'Ui', component: 'Input',
      props: { placeholder: 'NCP 공식 가이드', 'aria-label': '표시 이름' },
    } },
    urlAddr: { id: 'urlAddr', data: {
      type: 'Ui', component: 'Input',
      props: { placeholder: 'https://...', 'aria-label': '주소' },
    } },
    urlAdd: { id: 'urlAdd', data: { type: 'Ui', component: 'Button', props: { 'data-icon': 'plus' }, content: '추가' } },

    // — aside (publish panel) —
    aside: { id: 'aside', data: { type: 'Aside', flow: 'form', width: 320, labelledBy: 'secPublish-h' } },
    secPublish: { id: 'secPublish', data: { type: 'Section', heading: { content: '게시 설정' } } },
    publishBtns: { id: 'publishBtns', data: { type: 'Row', flow: 'cluster', roledescription: 'actions' } },
    publishNow: { id: 'publishNow', data: { type: 'Ui', component: 'Button', content: '게시하기' } },
    saveDraft: { id: 'saveDraft', data: { type: 'Ui', component: 'Button', content: '임시저장' } },

    secSchedule: { id: 'secSchedule', data: { type: 'Section', heading: { variant: 'h3', content: '게시 예약' } } },
    schedDate: { id: 'schedDate', data: {
      type: 'Ui', component: 'Input',
      props: { type: 'date', defaultValue: '2026-04-25', 'aria-label': '날짜' },
    } },
    schedTime: { id: 'schedTime', data: {
      type: 'Ui', component: 'Input',
      props: { type: 'time', defaultValue: '10:00', 'aria-label': '시간' },
    } },
    schedBtn: { id: 'schedBtn', data: { type: 'Ui', component: 'Button', content: '예약 설정' } },

    secVis: { id: 'secVis', data: { type: 'Section', heading: { variant: 'h3', content: '노출 설정' } } },
    ...visibilityRows(visible, setVisible),

    secDanger: { id: 'secDanger', data: { type: 'Section', heading: { variant: 'h3', content: '위험 영역' }, roledescription: 'danger' } },
    delBtn: { id: 'delBtn', data: { type: 'Ui', component: 'Button', content: '이 영상 삭제' } },
    delNote: { id: 'delNote', data: { type: 'Text', variant: 'small',
      content: '수강 이력이 있는 경우 삭제 전 확인이 필요합니다' } },
  }

  const relationships: RelMap = {
    [ROOT]: ['form'],
    form: ['main', 'aside'],

    main: ['secUpload', 'secBasic', 'secMedia'],
    secUpload: ['uploadFile', 'uploadNote', 'uploadProgress'],
    secBasic: [
      'f-title', 'f-level', 'f-duration',
      'rolesWrap', 'certsWrap', 'tagsWrap', 'servicesWrap', 'f-desc',
    ],
    'f-title':    ['fl-title', 'fc-title'],
    'f-level':    ['fl-level', 'fc-level'],
    'f-duration': ['fl-duration', 'fc-duration', 'fd-duration'],
    'f-desc':     ['fl-desc', 'fc-desc'],

    rolesWrap: ['rolesLegend', ...Object.keys(roles).map((k) => `role-row-${k}`)],
    ...checkboxRels('role', roles),

    certsWrap: ['certsLegend', ...Object.keys(certs).map((k) => `cert-row-${k}`), 'certsNote'],
    ...checkboxRels('cert', certs),

    tagsWrap: ['tagsLegend', 'tagsList', 'tagInputEl', 'tagsHint'],
    tagsList: tags.map((t) => `tag-chip-${t}`),
    ...tagChipRels(),

    servicesWrap: ['servicesLegend', 'servicesList'],
    servicesList: services.map((t) => `svc-chip-${t}`),
    ...tagChipRels(),

    secMedia: ['thumbLabel','thumbFile','thumbNote','docsLabel','docsFile','docsNote','urlWrap'],
    urlWrap: ['urlLegend','urlName','urlAddr','urlAdd'],

    aside: ['secPublish','secSchedule','secVis','secDanger'],
    secPublish: ['publishBtns'],
    publishBtns: ['publishNow','saveDraft'],
    secSchedule: ['schedDate','schedTime','schedBtn'],
    secVis: ['vis-row-online','vis-row-roleMain','vis-row-certMain'],
    ...visibilityRels(visible),
    secDanger: ['delBtn','delNote'],
  }

  return <Renderer page={definePage({ entities, relationships })} />
}

/* ── helpers ───────────────────────────────────────────────────── */

function fieldNode(
  key: string, label: string, required: boolean,
  control: Record<string, unknown>, description?: string,
): NodeMap {
  const out: NodeMap = {
    [`f-${key}`]: { id: `f-${key}`, data: { type: 'Ui', component: 'Field', props: { required } } },
    [`fl-${key}`]: { id: `fl-${key}`, data: { type: 'Ui', component: 'FieldLabel', content: label } },
    [`fc-${key}`]: { id: `fc-${key}`, data: control },
  }
  if (description) {
    out[`fd-${key}`] = { id: `fd-${key}`, data: { type: 'Ui', component: 'FieldDescription', content: description } }
  }
  return out
}

function checkboxRows<K extends string>(
  prefix: string,
  state: Record<K, boolean>,
  setter: (next: Record<K, boolean>) => void,
  labels: Record<K, string>,
): NodeMap {
  const out: NodeMap = {}
  for (const k of Object.keys(state) as K[]) {
    out[`${prefix}-row-${k}`] = { id: `${prefix}-row-${k}`, data: { type: 'Row', flow: 'cluster' } }
    out[`${prefix}-cb-${k}`] = {
      id: `${prefix}-cb-${k}`,
      data: {
        type: 'Ui', component: 'Checkbox',
        props: {
          checked: state[k],
          onClick: () => setter({ ...state, [k]: !state[k] }),
          'aria-label': labels[k],
        },
      },
    }
    out[`${prefix}-lbl-${k}`] = { id: `${prefix}-lbl-${k}`, data: { type: 'Text', variant: 'body', content: labels[k] } }
  }
  return out
}

function checkboxRels<K extends string>(prefix: string, state: Record<K, boolean>): RelMap {
  const out: RelMap = {}
  for (const k of Object.keys(state)) {
    out[`${prefix}-row-${k}`] = [`${prefix}-cb-${k}`, `${prefix}-lbl-${k}`]
  }
  return out
}

function tagChipNodes(prefix: string, items: string[], onRemove: (t: string) => void): NodeMap {
  const out: NodeMap = {}
  for (const t of items) {
    // parts/Tag — span[data-part="tag"] + optional × remove. label/onRemove 데이터 주도.
    out[`${prefix}-chip-${t}`] = {
      id: `${prefix}-chip-${t}`,
      data: {
        type: 'Ui', component: 'Tag',
        props: { label: t, onRemove: () => onRemove(t), removeLabel: `${t} 제거` },
      },
    }
  }
  return out
}

function tagChipRels(): RelMap {
  // Tag는 leaf — relationships 없음.
  return {}
}

function visibilityRows(
  state: { online: boolean; roleMain: boolean; certMain: boolean },
  setter: (next: typeof state) => void,
): NodeMap {
  const labels: Record<keyof typeof state, string> = {
    online: '온라인교육 노출', roleMain: '메인 역할 코스 노출', certMain: '메인 자격증 코스 노출',
  }
  const out: NodeMap = {}
  for (const k of Object.keys(state) as (keyof typeof state)[]) {
    out[`vis-row-${k}`] = { id: `vis-row-${k}`, data: { type: 'Row', flow: 'cluster' } }
    out[`vis-sw-${k}`] = {
      id: `vis-sw-${k}`,
      data: {
        type: 'Ui', component: 'Switch',
        props: { checked: state[k], onClick: () => setter({ ...state, [k]: !state[k] }), 'aria-label': labels[k] },
      },
    }
    out[`vis-lbl-${k}`] = { id: `vis-lbl-${k}`, data: { type: 'Text', variant: 'body', content: labels[k] } }
  }
  return out
}

function visibilityRels(state: { online: boolean; roleMain: boolean; certMain: boolean }): RelMap {
  const out: RelMap = {}
  for (const k of Object.keys(state)) {
    out[`vis-row-${k}`] = [`vis-sw-${k}`, `vis-lbl-${k}`]
  }
  return out
}
