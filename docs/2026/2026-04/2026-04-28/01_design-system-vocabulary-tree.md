---
type: reference
status: active
tags: [design-system, tokens, components, vocabulary]
---

# Design System Vocabulary Tree (de facto)

업계(M3 · Apple HIG · Carbon · Polaris · Radix · Atlassian · Spectrum · Fluent · Primer · Tailwind · Linear · Vercel · W3C DTCG)에서 수렴되는 어휘만. 한 시스템 고유 용어는 제외.

```tree
Design System Universe
│
├── 1. Design System (meta)            # 우산 — 모든 산출물을 묶는 체계
│   ├── foundations                    # 기반 결정 (M3·Carbon·Polaris 공통)
│   │   ├── color                      # ramp · semantic role · pair
│   │   ├── typography                 # type scale · font stack · weight
│   │   ├── spacing                    # 4/8 grid · density
│   │   ├── shape / radius             # corner family (M3 shape, Carbon)
│   │   ├── elevation / shadow         # z-stack (M3 0-5, Tailwind sm-2xl)
│   │   ├── motion                     # duration · easing curve · choreography
│   │   ├── iconography                # stroke · grid · optical size
│   │   ├── grid / layout              # column · gutter · breakpoint
│   │   └── sound / haptics            # HIG · Material extended
│   ├── primitives                     # 무스타일 building block (Radix·RAC)
│   ├── components                     # 부품 — 아래 Component System 트리
│   ├── patterns                       # 합성 (Empty State · Login · Wizard) (Polaris·Atlassian)
│   ├── templates                      # 페이지 골격 (Atomic Design)
│   ├── pages                          # 인스턴스 (Atomic Design)
│   ├── principles                     # 디자인 원칙 (HIG: Clarity·Deference·Depth)
│   ├── guidelines                     # 사용 규약 (do/don't · 작성 규칙)
│   ├── brand                          # 로고 · 색상 · 톤 (브랜드 layer)
│   ├── content / voice & tone         # writing style (Polaris content, Mailchimp)
│   ├── accessibility (a11y)           # WCAG 2.2 AA · WAI-ARIA APG
│   ├── localization (i18n / l10n)     # RTL · plural · date · currency
│   ├── motion language                # principle (M3 expressive, Apple fluid)
│   └── governance                     # versioning · contribution · changelog
│
├── 2. Token System                    # 토큰 어휘 (W3C DTCG 표준)
│   ├── tier (계층)                    # 거의 모든 시스템이 3단을 채택
│   │   ├── primitive / reference / raw     # M3 ref · Tailwind palette · Adobe global
│   │   ├── semantic / system / alias        # M3 sys · Carbon role · Polaris semantic
│   │   ├── component / scoped               # M3 comp · Adobe component
│   │   └── (확장) variant / mode / theme    # light/dark/HC · brand
│   ├── format (W3C DTCG)              # design-tokens.org 표준
│   │   ├── $value                     # 실 값
│   │   ├── $type                      # color · dimension · fontFamily · duration · cubicBezier · shadow · gradient · transition · typography · strokeStyle · border · number
│   │   ├── $description               # 의도 주석
│   │   ├── $extensions                # 벤더 확장
│   │   └── reference syntax           # "{color.brand.primary}"
│   ├── category (수렴된 분류)
│   │   ├── color                      # 가장 표준화된 카테고리
│   │   │   ├── ramp / scale           # 50-950 (Tailwind) · 1-12 (Radix) · 0-100 (Carbon)
│   │   │   ├── alpha scale            # a1-a12 (Radix) · alpha overlays
│   │   │   ├── semantic role          # text · surface · border · accent · status
│   │   │   │   ├── text               # primary · secondary · tertiary · disabled · on-color · link · inverse
│   │   │   │   ├── surface / background  # default · subtle · raised · sunken · overlay · inverse
│   │   │   │   ├── border             # default · subtle · strong · focus · selected
│   │   │   │   ├── accent / brand     # primary · secondary · tertiary
│   │   │   │   ├── status             # info · success · warning · danger · critical · neutral
│   │   │   │   └── interaction        # hover · pressed · focus · selected · disabled
│   │   │   ├── pair / on-color        # M3 on-X · Material color pair
│   │   │   └── mode                   # light · dark · high-contrast · color-blind safe
│   │   ├── typography
│   │   │   ├── font family            # sans · serif · mono · display
│   │   │   ├── font weight            # 100-900 (regular · medium · semibold · bold)
│   │   │   ├── font size scale        # display · headline · title · body · label · caption (M3 type scale)
│   │   │   ├── line height            # tight · normal · relaxed · loose
│   │   │   ├── letter spacing / tracking
│   │   │   ├── paragraph spacing
│   │   │   └── composite type token   # M3 typescale role (display-lg, body-md…)
│   │   ├── spacing                    # 4/8 grid 거의 보편
│   │   │   ├── scale                  # 0 · 1 · 2 · 3 · 4 · 6 · 8 · 12 · 16 · 24 · 32 · 48 · 64
│   │   │   ├── inset                  # padding 안쪽
│   │   │   ├── stack                  # vertical gap
│   │   │   ├── inline                 # horizontal gap
│   │   │   └── density                # compact · default · comfortable (Carbon density)
│   │   ├── sizing                     # width · height · min/max · icon size
│   │   ├── radius / shape             # none · xs · sm · md · lg · xl · full · pill
│   │   ├── elevation                  # 0-5 (M3) · sm/md/lg/xl/2xl (Tailwind)
│   │   │   ├── shadow                 # blur · offset · color · spread
│   │   │   └── surface tint           # M3 elevation tint overlay
│   │   ├── motion
│   │   │   ├── duration               # instant · short · medium · long (50-700ms)
│   │   │   ├── easing / curve         # standard · emphasized · decelerate · accelerate · linear (M3·HIG)
│   │   │   └── transition             # composite (duration + easing + property)
│   │   ├── breakpoint                 # xs · sm · md · lg · xl · 2xl (Tailwind 표준화)
│   │   ├── z-index                    # base · dropdown · sticky · overlay · modal · toast · tooltip
│   │   ├── opacity                    # disabled · hover · pressed · scrim
│   │   ├── border / stroke            # width · style · color (composite)
│   │   ├── focus ring                 # width · offset · color
│   │   └── iconography                # size · stroke · grid
│   └── theming
│       ├── mode                       # light · dark · system · high-contrast
│       ├── brand                      # multi-brand swap
│       ├── density                    # compact · default · comfortable
│       └── direction                  # ltr · rtl
│
└── 3. Component System
    ├── classification (분류 모델)
    │   ├── Atomic Design (Brad Frost) # 가장 보편 어휘
    │   │   ├── atoms                  # button · input · icon · label
    │   │   ├── molecules              # field · search box · card header
    │   │   ├── organisms              # navbar · form · data table
    │   │   ├── templates              # page skeleton
    │   │   └── pages                  # 실 인스턴스
    │   ├── lane / tier (DS 본 분류)   # Polaris·Carbon·Material 카테고리 합집합
    │   │   ├── primitives             # Box · Slot · Portal · VisuallyHidden
    │   │   ├── status / feedback      # Badge · Tag · Progress · Spinner · Toast · Banner · Alert · Skeleton
    │   │   ├── action                 # Button · IconButton · Link · ButtonGroup · ToggleButton
    │   │   ├── input                  # Field · TextInput · Textarea · NumberInput · DateInput · Slider · ColorPicker
    │   │   ├── selection              # Checkbox · Radio · Switch · Select · Combobox · Listbox · Tree · Tabs · Segmented
    │   │   ├── display                # Card · Table · List · Avatar · Image · Code · KeyValue · Stat · Timeline
    │   │   ├── overlay                # Dialog · Modal · Drawer · Popover · Tooltip · Menu · ContextMenu · Toast
    │   │   ├── navigation             # Nav · Sidebar · Breadcrumb · Pagination · Stepper · CommandPalette
    │   │   └── layout                 # Container · Stack · Cluster · Grid · Split · Sidebar layout · Center
    │   └── pattern (합성)             # Empty state · Onboarding · Wizard · Login · Search · Filter · Bulk action
    ├── anatomy (내부 어휘)             # Radix·RAC·HeadlessUI 수렴
    │   ├── root                       # 컴포넌트 루트
    │   ├── trigger                    # 여는 버튼 (Popover.Trigger)
    │   ├── content / panel            # 본문 (Tabs.Panel · Popover.Content)
    │   ├── group                      # 묶음 (Radio.Group)
    │   ├── label                      # 라벨
    │   ├── description / hint         # 보조 설명
    │   ├── indicator                  # 상태 표시 (Checkbox.Indicator)
    │   ├── separator                  # 구분선
    │   ├── header / footer            # 영역 머리/꼬리
    │   ├── item                       # 반복 단위
    │   ├── icon                       # 아이콘 슬롯
    │   ├── arrow                      # 말풍선 화살표 (tooltip/popover)
    │   ├── overlay / scrim            # 배경 가림막
    │   ├── close                      # 닫기 컨트롤
    │   ├── slot                       # 폴리모픽 자리 (Radix Slot · RAC)
    │   └── portal                     # DOM 탈출 mount
    ├── props axes (변형 차원)
    │   ├── variant                    # filled · tinted · outlined · ghost · plain (M3·HIG·Carbon)
    │   ├── size                       # xs · sm · md · lg · xl
    │   ├── tone / intent / status     # neutral · primary · success · warning · danger · info
    │   ├── density                    # compact · default · comfortable
    │   ├── shape                      # rounded · pill · square
    │   ├── orientation                # horizontal · vertical
    │   ├── placement                  # top · right · bottom · left · start · end
    │   ├── alignment                  # start · center · end · baseline · stretch
    │   ├── as / asChild               # 폴리모픽 (Radix asChild · MUI as)
    │   └── loading / pending          # 비동기 상태
    ├── interaction states             # WAI-ARIA + CSS pseudo 합집합
    │   ├── rest / default
    │   ├── hover
    │   ├── focus / focus-visible      # 키보드 포커스만
    │   ├── focus-within
    │   ├── active / pressed
    │   ├── selected                   # aria-selected
    │   ├── checked / mixed            # aria-checked (tri-state)
    │   ├── expanded / collapsed       # aria-expanded
    │   ├── open / closed              # data-state (Radix)
    │   ├── disabled                   # aria-disabled
    │   ├── readonly                   # aria-readonly
    │   ├── invalid / error            # aria-invalid
    │   ├── required                   # aria-required
    │   ├── busy / loading             # aria-busy
    │   ├── current                    # aria-current
    │   └── visited                    # link
    ├── ARIA roles (WAI-ARIA 1.2)      # 컴포넌트와 정합되는 role 어휘
    │   ├── widget                     # button · link · checkbox · radio · switch · slider · spinbutton · textbox · combobox · listbox · option · menu · menuitem · menuitemcheckbox · menuitemradio · tab · tabpanel · tablist · tree · treeitem · grid · gridcell · row · columnheader
    │   ├── document structure         # article · region · group · list · listitem · separator · heading · figure · table · row · cell · columnheader · rowheader
    │   ├── landmark                   # banner · navigation · main · complementary · contentinfo · search · form
    │   ├── live region                # alert · status · log · marquee · timer
    │   └── window                     # dialog · alertdialog
    ├── WAI-ARIA APG patterns          # APG (Authoring Practices Guide) 표준 패턴
    │   ├── disclosure · accordion
    │   ├── dialog (modal · non-modal · alertdialog)
    │   ├── menu / menubar
    │   ├── tabs
    │   ├── combobox (autocomplete · list · grid)
    │   ├── listbox (single · multi)
    │   ├── tree / treegrid
    │   ├── grid / table
    │   ├── carousel
    │   ├── toolbar
    │   ├── breadcrumb
    │   ├── pagination
    │   ├── slider (single · range)
    │   ├── tooltip
    │   ├── feed
    │   └── radio group / checkbox / switch
    └── keyboard model (수렴)
        ├── Tab · Shift+Tab            # 포커스 이동 (포커스 가능한 것 사이)
        ├── Arrow keys                 # roving tabindex 내부 이동
        ├── Home · End                 # 처음/끝
        ├── PageUp · PageDown          # 큰 점프
        ├── Enter · Space              # activate
        ├── Escape                     # close · cancel
        ├── Type-ahead                 # listbox/menu 첫글자 탐색
        └── Modifier (Cmd/Ctrl · Shift · Alt)  # 다중 선택 · range 확장
```

## 출처 수렴 메모

- **3-tier token** (primitive/semantic/component): Material 3 (ref/sys/comp), Adobe Spectrum (global/alias/component), Salesforce SLDS, IBM Carbon — 4개 이상 수렴.
- **Color ramp scale**: Tailwind 50-950, Radix 1-12, Carbon 10-100. 숫자 표기는 다르지만 "12단 정도의 ramp + alpha scale" 합의.
- **Typography role**: Material 3 type scale (display/headline/title/body/label) 가 가장 널리 차용.
- **Component anatomy**: Radix Primitives · React Aria Components · HeadlessUI · Ariakit 의 part 이름이 거의 일치 (root/trigger/content/item/indicator/group/label).
- **State 어휘**: WAI-ARIA 속성 이름이 그대로 prop/data-state 가 됨 (open/checked/expanded/selected/disabled).
- **Density 3단** (compact/default/comfortable): Carbon, Atlassian, Material — 동일 어휘.
- **W3C DTCG**: design-tokens.github.io community group 표준 (`$value`/`$type`/`$description`).
