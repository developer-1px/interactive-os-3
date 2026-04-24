# Mock vs Impl outline comparator

원본 시안(`docs/edu-portal-admin.html`)과 우리 FlatLayout 구현의 **콘텐츠 누락/여분**을 기계적으로 비교한다. LLM 시각 감사 대신 정규화된 outline JSON을 diff한다.

## 구성

```
scripts/compare/
  extractOutline.mjs   # 공통 추출기. 브라우저·Node 공용. Item[] 반환
  diffOutlines.mjs     # 두 JSON 비교 → 누락 / 여분 / 메타 차이 리포트
  mock.json            # 원본 추출 스냅샷 (git ignore)
  impl.json            # 구현 추출 스냅샷 (git ignore)
```

## 절차

1. **public에 mock 서빙**
   ```sh
   cp docs/edu-portal-admin.html public/mock.html
   ```
   vite가 `http://localhost:5173/mock.html`로 same-origin 서빙한다.

2. **mock 추출** (Chrome MCP)
   ```
   navigate http://localhost:5173/mock.html
   javascript_tool: <inject extractOutline + return JSON>
   → mock.json 에 저장
   ```

3. **impl 추출**
   ```
   navigate http://localhost:5173/edu-portal-admin/dashboard
   javascript_tool: <inject extractOutline + return JSON>
   → impl.json 에 저장
   ```

4. **diff**
   ```sh
   node scripts/compare/diffOutlines.mjs scripts/compare/mock.json scripts/compare/impl.json
   ```

## 출력 예시

```
=== Mock outline: 31 items ===
=== Impl outline: 31 items ===

✓ no missing items
✓ no extra items

⚠  MATCHED with meta differences (2):
  list [🔍 검색키워드 Top 10] Top10
    mock: {"items":0}   ← JS hydration 전 스냅샷
    impl: {"items":3}
```

## 키 설계

각 item은 `kind:parent:label`을 고유 키로 갖는다:

- **kind**: panel / toolbar / button / field / stat / chart / table / list / legend
- **parent**: 포함하는 panel의 label (없으면 null)
- **label**: accessible name (aria-label / heading / panel-title)
- **meta**: kind별 보조 (cols/rows/headers/items/value/bars 등)

동일 키가 양쪽에 있으면 **matched**, mock에만 있으면 **missing**, impl에만 있으면 **extra**.

## 알려진 한계

- **JS hydration 타이밍**: mock의 `.top10-list` `<tbody id="dropout-tbody">` 등은 JS로 런타임에 채움. 추출 시점에 DOM 비어있을 수 있음 → meta 차이로 드러남
- **hidden 노드**: 양쪽 모두 "DOM에 존재하면 포함"으로 통일. 원본은 `display:none`, 구현은 native `hidden` 속성으로 숨김
- **새 위젯 추가 시**: extractor에 해당 위젯의 `data-ds="..."` 셀렉터와 추출 규칙을 추가해야 diff가 의미를 가짐
