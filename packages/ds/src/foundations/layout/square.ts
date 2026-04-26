import { css } from '../primitives/css'

// 29.5px 높이 계약 + 콘텐츠 중앙 정렬 축.
// clickable·control·사용자 정의 컨트롤 모두 이 한 함수로 정렬된다.
// inline-flex + center는 "컨트롤 내부의 아이콘·텍스트가 vertically·horizontally 가운데
// 위치해야 한다"는 규약을 한 곳에서 박아둔 것 — data-icon::before + 텍스트 조합이 baseline이
// 아닌 기하 중앙에 놓이게 만든다. <input>/<select>/<textarea>는 replaced element라 내부에
// 영향 없음.
// 정사각형 축 — width(또는 height) 한 축만 정해도 다른 축이 비율로 도출되는 모양.
// avatar / icon-tile / icon-only button처럼 1:1이 의미인 곳에 일괄 적용.
// "축 하나만 결정되면 정사각형"이라는 규칙을 한 곳에 박아 widget이 padding hack 없이
// width 또는 height만 주고 끝낸다.
/** @demo type=structural fn=square args=["button"] */
export const square = (sel: string) => css`
  :where(${sel}) {
    aspect-ratio: 1 / 1;
    padding: 0;
    display: inline-grid;
    place-items: center;
  }
`
