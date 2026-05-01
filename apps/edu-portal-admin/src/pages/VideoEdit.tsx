import { useState } from 'react'
import { Renderer, definePage, ROOT } from '@p/ds'
import {
  fieldNode, tagChipNodes, tagChipRels,
  type NodeMap, type RelMap,
} from './videoEditHelpers'

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

  // CheckboxField/SwitchField 노드 생성기 — 한 항목 = 한 노드, Wrap+Row+Checkbox+Text
  // 4-노드 분해 패턴 종료. ARIA grouping 은 부모 Fieldset 의 native <fieldset>이 담당.
  const checkboxNodes = <K extends string>(
    prefix: string,
    state: Record<K, boolean>,
    setter: (next: Record<K, boolean>) => void,
    labels: Record<K, string>,
  ): NodeMap => {
    const out: NodeMap = {}
    for (const k of Object.keys(state) as K[]) {
      out[`${prefix}-cb-${k}`] = {
        id: `${prefix}-cb-${k}`,
        data: {
          type: 'Ui', component: 'CheckboxField',
          props: {
            label: labels[k],
            checked: state[k],
            onChange: (next: boolean) => setter({ ...state, [k]: next }),
          },
        },
      }
    }
    return out
  }
  const switchNodes = (
    state: typeof visible,
    setter: (next: typeof visible) => void,
  ): NodeMap => {
    const labels: Record<keyof typeof state, string> = {
      online: '온라인교육 노출', roleMain: '메인 역할 코스 노출', certMain: '메인 자격증 코스 노출',
    }
    const out: NodeMap = {}
    for (const k of Object.keys(state) as (keyof typeof state)[]) {
      out[`vis-sw-${k}`] = {
        id: `vis-sw-${k}`,
        data: {
          type: 'Ui', component: 'SwitchField',
          props: {
            label: labels[k],
            checked: state[k],
            onChange: (next: boolean) => setter({ ...state, [k]: next }),
          },
        },
      }
    }
    return out
  }

  const entities: NodeMap = {
    [ROOT]: { id: ROOT, data: {} },
    form: { id: 'form', data: { type: 'Row', flow: 'form', label: '영상 편집' } },

    // — main column —
    main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },

    // upload section
    secUpload: { id: 'secUpload', data: { type: 'Section', heading: { content: '영상 파일' } } },
    uploadFile: { id: 'uploadFile', data: {
      type: 'Ui', component: 'FileInput',
      props: { accept: 'video/mp4,video/quicktime', buttonLabel: '영상 업로드', 'aria-label': '영상 업로드' },
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

    // roles fieldset — single Fieldset node, CheckboxField 자식들
    rolesSet: { id: 'rolesSet', data: {
      type: 'Ui', component: 'Fieldset',
      props: { legend: '역할', required: true, 'data-part': 'fieldset' },
    } },
    ...checkboxNodes('role', roles, setRoles, {
      dev: '개발자', eng: '엔지니어', sec: '보안', ai: 'AI',
    }),

    certsSet: { id: 'certsSet', data: {
      type: 'Ui', component: 'Fieldset',
      props: {
        legend: '코스',
        hint: '(기술자격증 연관 코스 선택)',
        description: '해당 자격증 준비에 도움이 되는 영상에 체크하세요.',
        'data-part': 'fieldset',
      },
    } },
    ...checkboxNodes('cert', certs, setCerts, { nca: 'NCA', ncp: 'NCP', nce: 'NCE' }),

    // tag inputs
    tagsSet: { id: 'tagsSet', data: {
      type: 'Ui', component: 'Fieldset',
      props: { legend: '주요 키워드', description: 'Enter로 태그 추가', 'data-part': 'fieldset' },
    } },
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

    servicesSet: { id: 'servicesSet', data: {
      type: 'Ui', component: 'Fieldset',
      props: { legend: '다루는 서비스', 'data-part': 'fieldset' },
    } },
    servicesList: { id: 'servicesList', data: { type: 'Row', flow: 'cluster', label: '서비스 태그' } },
    ...tagChipNodes('svc', services, (t) => removeTag(services, setServices, t)),

    ...fieldNode('desc', '영상 소개', true, {
      type: 'Ui', component: 'Textarea',
      props: { rows: 4, defaultValue: 'NCP Kubernetes Service(NKS)를 활용하여 컨테이너 기반 애플리케이션을 배포하고 운영하는 방법을 학습합니다.' },
    }),

    // media
    secMedia: { id: 'secMedia', data: { type: 'Section', heading: { content: '미디어 및 첨부파일' } } },

    thumbField: { id: 'thumbField', data: { type: 'Ui', component: 'Field', props: { required: false } } },
    thumbLabel: { id: 'thumbLabel', data: { type: 'Ui', component: 'FieldLabel', content: '썸네일 이미지' } },
    thumbFile: { id: 'thumbFile', data: {
      type: 'Ui', component: 'FileInput',
      props: { accept: 'image/*', buttonLabel: '이미지 선택', 'aria-label': '썸네일 이미지' },
    } },
    thumbNote: { id: 'thumbNote', data: { type: 'Ui', component: 'FieldDescription', content: 'JPG, PNG · 권장 1280×720px' } },

    docsField: { id: 'docsField', data: { type: 'Ui', component: 'Field', props: { required: false } } },
    docsLabel: { id: 'docsLabel', data: { type: 'Ui', component: 'FieldLabel', content: '관련 문서' } },
    docsFile: { id: 'docsFile', data: {
      type: 'Ui', component: 'FileInput',
      props: { multiple: true, buttonLabel: '문서 선택', 'aria-label': '관련 문서' },
    } },
    docsNote: { id: 'docsNote', data: { type: 'Ui', component: 'FieldDescription', content: 'PDF, PPT, ZIP — 복수 업로드 가능' } },

    urlSet: { id: 'urlSet', data: {
      type: 'Ui', component: 'Fieldset',
      props: { legend: '관련 URL', 'data-part': 'fieldset' },
    } },
    urlRow: { id: 'urlRow', data: { type: 'Row', flow: 'cluster' } },
    urlName: { id: 'urlName', data: {
      type: 'Ui', component: 'Input', grow: true,
      props: { placeholder: 'NCP 공식 가이드', 'aria-label': '표시 이름' },
    } },
    urlAddr: { id: 'urlAddr', data: {
      type: 'Ui', component: 'Input', grow: true,
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
    ...switchNodes(visible, setVisible),

    secDanger: { id: 'secDanger', data: { type: 'Section', heading: { variant: 'h3', content: '위험 영역' }, roledescription: 'danger' } },
    delBtn: { id: 'delBtn', data: { type: 'Ui', component: 'Button', props: { variant: 'destructive' }, content: '이 영상 삭제' } },
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
      'rolesSet', 'certsSet', 'tagsSet', 'servicesSet', 'f-desc',
    ],
    'f-title':    ['fl-title', 'fc-title'],
    'f-level':    ['fl-level', 'fc-level'],
    'f-duration': ['fl-duration', 'fc-duration', 'fd-duration'],
    'f-desc':     ['fl-desc', 'fc-desc'],

    rolesSet: Object.keys(roles).map((k) => `role-cb-${k}`),
    certsSet: Object.keys(certs).map((k) => `cert-cb-${k}`),

    tagsSet:  ['tagsList', 'tagInputEl'],
    tagsList: tags.map((t) => `tag-chip-${t}`),
    ...tagChipRels(),

    servicesSet:  ['servicesList'],
    servicesList: services.map((t) => `svc-chip-${t}`),

    secMedia: ['thumbField', 'docsField', 'urlSet'],
    thumbField: ['thumbLabel', 'thumbFile', 'thumbNote'],
    docsField:  ['docsLabel',  'docsFile',  'docsNote'],
    urlSet:  ['urlRow'],
    urlRow:  ['urlName', 'urlAddr', 'urlAdd'],

    aside: ['secPublish','secSchedule','secVis','secDanger'],
    secPublish: ['publishBtns'],
    publishBtns: ['publishNow','saveDraft'],
    secSchedule: ['schedDate','schedTime','schedBtn'],
    secVis: Object.keys(visible).map((k) => `vis-sw-${k}`),
    secDanger: ['delBtn','delNote'],
  }

  return <Renderer page={definePage({ entities, relationships })} />
}
