// 위계 검증 데모 — buildChatPage는 vite 의존(import.meta.glob)이 있어 직접 import 불가.
// 대신 chat 페이지의 entities/relationships를 그대로 옮긴 fixture로 검증한다.
import { printTree, printHeadingOutline } from '../src/ds/debug/printTree'
import type { NormalizedData } from '../src/ds/core/types'

const data: NormalizedData = {
  entities: {
    __root__: { id: '__root__', data: {} },
    page: { id: 'page', data: { type: 'Row', flow: 'list', roledescription: 'chat-page', label: 'Chat' } },
    side: { id: 'side', data: { type: 'Column', flow: 'list', emphasis: 'sunk' } },
    chHdr: { id: 'chHdr', data: { type: 'Text', variant: 'strong', content: '채널' } },
    pubList: { id: 'pubList', data: { type: 'Ui', component: 'Listbox', props: { 'aria-label': '채널' } } },
    dmHdr: { id: 'dmHdr', data: { type: 'Text', variant: 'strong', content: 'DM' } },
    dmList: { id: 'dmList', data: { type: 'Ui', component: 'Listbox', props: { 'aria-label': 'DM' } } },
    main: { id: 'main', data: { type: 'Column', flow: 'list', grow: true } },
    mainHdr: { id: 'mainHdr', data: { type: 'Header', flow: 'split' } },
    mainTitle: { id: 'mainTitle', data: { type: 'Text', variant: 'h2', content: '# ds' } },
    mainActions: { id: 'mainActions', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '채널 액션' } } },
    stream: { id: 'stream', data: { type: 'Column', flow: 'list', grow: true, emphasis: 'sunk' } },
    composer: { id: 'composer', data: { type: 'Row', flow: 'cluster', emphasis: 'raised' } },
    composerIn: { id: 'composerIn', data: { type: 'Ui', component: 'Input', props: { 'aria-label': '메시지' } } },
    composerSend: { id: 'composerSend', data: { type: 'Ui', component: 'Button', content: '전송' } },
    right: { id: 'right', data: { type: 'Column', flow: 'list', emphasis: 'raised' } },
  },
  relationships: {
    __root__: ['page'],
    page: ['side', 'main', 'right'],
    side: ['chHdr', 'pubList', 'dmHdr', 'dmList'],
    main: ['mainHdr', 'stream', 'composer'],
    mainHdr: ['mainTitle', 'mainActions'],
    composer: ['composerIn', 'composerSend'],
  },
}

console.log('=== TREE ===')
console.log(printTree(data))
console.log('\n=== HEADING OUTLINE ===')
console.log(printHeadingOutline(data))
