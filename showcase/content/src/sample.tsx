/**
 * Prose 시맨틱 태그 시연 — 카탈로그가 아니라 **읽히는 에세이**.
 *
 * LLM 시대 마크다운 타이포그래피를 주제로 한 단일 article. 모든 시맨틱 태그
 * (header/section/h1~h6/p/em/strong/code/kbd/pre/ul/ol/dl/blockquote/figure/
 * table/abbr/cite/del/ins/sub/sup/mark/small/aside/nav/footer/details/...)가
 * 자연스러운 글 흐름 안에서 등장한다. 읽기에 어색하지 않은 빈도로.
 *
 * 검증 목적: prose.ts 시각 결정이 진짜 글에서 어떻게 보이는지.
 */
export function ProseSample() {
  return (
    <>
      <header>
        <hgroup>
          <h1>LLM 시대의 마크다운 타이포그래피</h1>
          <p>
            <small>
              ds prose 디자인 노트 · <time dateTime="2026-04-26">2026년 4월 26일</time> ·{' '}
              <a href="mailto:developer.1px@gmail.com">developer.1px</a>
            </small>
          </p>
        </hgroup>
        <p>
          ChatGPT가 등장한 지 4년이 지나면서, 우리가 매일 읽는 텍스트의 모양이
          바뀌었다. <strong>볼드 폭격</strong>, <code>inline code</code> 폭격,
          끝없이 이어지는 중첩 리스트, 두 줄짜리 H3가 페이지를 채운다.
          기존 산문용 타이포그래피는 이 새로운 형식에 잘 맞지 않는다.
          이 글은 <em>왜</em> 그런지, 그리고 <em>어떻게</em> 다시 디자인했는지에 대한
          짧은 정리다.
        </p>
      </header>

      <section id="problem">
        <h2>문제 — 산문이 아니라 출력</h2>
        <p>
          전통적인 reading typography (가령 <cite>Tailwind Typography prose-base</cite>나
          Medium의 article 스타일)는 <em>인간이 천천히 쓴 산문</em>을 전제한다.
          단락은 길고, 헤딩은 드물게 나타나며, 강조는 단락 안에서 자연스럽게 흐른다.
          그런데 LLM이 출력하는 텍스트는 정반대다.
        </p>
        <ul>
          <li>한 답변에 <code>**bold**</code>가 평균 8~12회 등장한다.</li>
          <li><code>`inline code`</code>는 단락마다 거의 한 번씩 나온다.</li>
          <li>
            중첩 리스트는 3단계까지 자연스럽게 내려가고, 각 leaf 가
            <strong>또 굵은 글씨</strong>로 시작하기 일쑤다.
          </li>
          <li>H3가 페이지에 10개 이상 등장하기도 한다.</li>
        </ul>
        <p>
          기존 prose는 이 패턴에서 시각적으로 무너진다. 굵은 글씨가 본문보다 너무
          튀어 페이지가 무거워 보이고, inline code의 border가 눈을 흔들고,
          H3 사이 호흡이 평탄해서 위계가 사라진다. <mark>핵심은 빈도다</mark> —
          드물게 쓰일 걸 가정한 강조 장치들이 매 단락마다 등장하니 강조의 효과가
          희석된다.
        </p>
        <aside>
          <p>
            <strong>Sidenote.</strong> 이건 마크다운 viewer만의 문제가 아니다.
            Linear의 changelog, Stripe docs, GitHub PR description, Notion AI summary
            모두 비슷한 압력을 받는다. <abbr title="Large Language Model">LLM</abbr>이
            content layer 깊숙이 들어오면서 typography 자체가 다시 디자인되고 있다.
          </p>
        </aside>
      </section>

      <section id="approach">
        <h2>접근 — 빈도 기반 톤 다운</h2>
        <p>
          해법은 단순하다. <em>강조 장치의 weight를 한 단계씩 낮춘다</em>.
          드물게 쓰일 걸 가정한 데시벨이 매 단락마다 울리니, 기준 데시벨을
          내려야 평균 음량이 맞는다. 구체적으로:
        </p>
        <ol>
          <li>
            <strong>볼드</strong>는 <code>700</code> 대신 <code>600</code> (semibold).
            본문이 <code>400</code>이라 차이는 충분하지만, 페이지 무게는 가볍게.
          </li>
          <li>
            <strong>Inline code</strong>는 border 제거, 옅은 surface(회색 3~4%)에
            <code>weight: 400</code>으로. GitHub·Stripe·MDN이 이미 수렴한 패턴이다.
          </li>
          <li>
            <strong>Heading</strong>은 modular ratio 1.286(perfect fourth)로 단계 차이를
            크게 — H1 36, H2 28, H3 22, H4 18, H5 16, H6 13. weight ladder
            (extrabold→bold→semibold)가 색·크기와 함께 위계를 만든다.
          </li>
          <li>
            <strong>위·아래 마진</strong>은 Gestalt proximity로 위계를 표현 —
            H1=4em, H2=3em, H3·H4=2em, H5·H6=1.5em. 헤딩과 본문 사이는
            <em>0.25em</em>으로 거의 붙여 "헤딩이 자기 본문을 데리고 있다"고
            보이게 한다.
          </li>
        </ol>
        <p>
          이 네 가지가 누적되면 LLM 답변이 페이지에 들어와도 <em>읽히는</em> 페이지가
          된다. 강조는 강조 역할을 하고, 본문은 본문 역할을 한다.
        </p>
      </section>

      <section id="scale">
        <h2>스케일 — 정적 ladder가 정답</h2>
        <p>
          한때 <code>clamp()</code> fluid scale이 인기였다. 뷰포트에 따라 매끈하게
          줄어드는 헤딩 크기. 멋있어 보였지만, 실제로 써보면 위계가 산만해진다.
          헤딩끼리의 <em>비율</em>이 흐트러지기 때문이다.
        </p>
        <p>
          2026년 현재 Linear, Stripe docs, Vercel docs, Notion 모두 정적 ladder로
          돌아왔다. 1.250 (major third) 또는 1.286 (perfect fourth) 비율이 표준.
          ds는 후자를 채택했다.
        </p>
        <h3>Heading scale 비교</h3>
        <table>
          <caption>Modular scale 후보 비교 (h1~h6, px 기준)</caption>
          <thead>
            <tr>
              <th scope="col">Ratio</th>
              <th scope="col">h1</th>
              <th scope="col">h2</th>
              <th scope="col">h3</th>
              <th scope="col">h4</th>
              <th scope="col">h5</th>
              <th scope="col">h6</th>
              <th scope="col">특징</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1.200 minor third</th>
              <td>23</td><td>19</td><td>16</td><td>13</td><td>11</td><td>9</td>
              <td>차이 평탄</td>
            </tr>
            <tr>
              <th scope="row">1.250 major third</th>
              <td>31</td><td>25</td><td>20</td><td>16</td><td>13</td><td>10</td>
              <td>가장 안전</td>
            </tr>
            <tr>
              <th scope="row">1.286 perfect 4th</th>
              <td><strong>36</strong></td><td><strong>28</strong></td><td><strong>22</strong></td><td><strong>18</strong></td><td><strong>16</strong></td><td><strong>13</strong></td>
              <td>드라마틱, ds 채택</td>
            </tr>
            <tr>
              <th scope="row">1.333 perfect 4th+</th>
              <td>42</td><td>32</td><td>24</td><td>18</td><td>14</td><td>11</td>
              <td>H1 너무 큼</td>
            </tr>
          </tbody>
        </table>
        <p>
          <small>
            출처: Linear 디자인 토큰, Stripe docs computed style 측정, MDN docs CSS
            파일, 직접 측정.
          </small>
        </p>
      </section>

      <section id="implementation">
        <h2>구현 — 토큰과 cascade</h2>
        <p>
          이 디자인 결정은 <code>foundations</code> 토큰으로 내려간다. 매 widget이
          raw 수치를 쓰지 않고 의미 있는 이름을 통해 접근한다.
        </p>
        <pre><code>{`// foundations/typography/heading.ts
export const headingSize = (n: 1|2|3|4|5|6) =>
  ['2.25rem', '1.75rem', '1.375rem',
   '1.125rem', '1rem', '0.8125rem'][n - 1]

export const headingLeading = (n: 1|2|3|4|5|6) =>
  ['1.111', '1.286', '1.45',
   '1.5', '1.5', '1.5'][n - 1]
`}</code></pre>
        <p>
          그리고 prose.ts는 그 토큰을 소비한다. <kbd>Cmd</kbd>+<kbd>K</kbd>로
          소스를 점프하면 어떤 widget도 <code>2.25rem</code> 같은 raw 값을 쓰지
          않는다.
        </p>

        <h3>CSS Cascade Layers</h3>
        <p>
          가장 어려운 건 <em>스타일끼리의 충돌</em>이었다. form widget이
          <code>section &gt; h2:first-child {'{ font-size: 15px }'}</code>로 헤딩을
          억지로 작게 만들면, prose의 <code>[data-flow="prose"] h2 {'{ ... }'}</code>를
          specificity로 이긴다. 매 충돌마다 <code>!important</code>를 쓸 수도 없고,
          selector를 점점 길게 만들 수도 없다.
        </p>
        <p>
          답은 <strong>CSS Cascade Layers</strong>(<code>@layer</code>)다. 2022년부터
          모든 메이저 브라우저가 안정 지원한다. 레이어 순서로 우선순위가 결정되니
          specificity는 같은 layer 안에서만 본다.
        </p>
        <pre><code>{`@layer reset, states, widgets, parts, content, shell, apps;
@layer widgets { /* form 등 */ }
@layer content { /* prose */ }
// content layer 가 widgets 보다 강하다 — 항상.
`}</code></pre>
        <p>
          이걸 적용한 뒤로 <code>!important</code>는 0개, specificity 카운트는
          머릿속에서 사라졌다.
        </p>

        <h3>Reset은 0 specificity로</h3>
        <p>
          한 발 더 나아가, reset은 <code>:where()</code>로 감싼다. <code>:where(h1)</code>의
          specificity는 <code>0,0,0</code>이라 author가 쓴 어떤 규칙이든 자동으로 이긴다.
          reset이 "최후의 fallback"이라는 의미가 selector 자체에 박힌다.
        </p>
      </section>

      <section id="terms">
        <h2>용어 정리</h2>
        <p>이 글에서 등장한 핵심 용어를 정의 리스트로 정리한다.</p>
        <dl>
          <dt>Modular scale</dt>
          <dd>
            연속된 크기들이 일정한 비율로 증가하는 ladder. 1.250, 1.286 같은
            ratio가 대표적이다.
          </dd>
          <dt>Specificity</dt>
          <dd>
            CSS 규칙끼리 충돌할 때 어느 쪽이 이기는지 결정하는 점수.
            <code>(inline, id, class+attr+pseudo, element)</code> 4-tuple로 비교한다.
          </dd>
          <dt>Cascade layer</dt>
          <dd>
            <code>@layer</code>로 묶인 스타일 묶음. 후순위 layer가 specificity와
            무관하게 무조건 이긴다.
          </dd>
          <dt>Proximity (Gestalt)</dt>
          <dd>
            가까이 있는 요소를 한 묶음으로 인식하는 인지 원리.
            margin이 위계를 표현하는 근거.
          </dd>
        </dl>
      </section>

      <section id="quote">
        <h2>참고할 만한 인용</h2>
        <blockquote cite="https://practicaltypography.com">
          <p>
            Typography is the visual component of the written word. The same text
            can be set in countless typefaces, sizes, spacings, and arrangements
            — and each variation produces a different reading experience.
          </p>
          <p>— Matthew Butterick, <cite>Practical Typography</cite></p>
        </blockquote>
        <p>
          오래된 인용이지만 LLM 시대에 더 잘 들어맞는다. 같은 텍스트를 어떻게
          배치하느냐에 따라 <em>읽히는 글</em>이 되거나 <em>스크롤 대상</em>이 되거나
          한다.
        </p>
      </section>

      <section id="numbers">
        <h2>측정 — 실제 숫자</h2>
        <p>
          이 페이지를 브라우저에서 실측하면 다음 수치가 나온다 (root font 13.5px,
          prose body는 절대 16px로 분리).
        </p>
        <ul>
          <li>본문: 16px / line-height 28px (1.75)</li>
          <li>H1: 36px / weight 700 / line-height 1.111</li>
          <li>H2: 28px / weight 700 / mt 70px ≈ 3em</li>
          <li>H3: 22px / weight 600 / mt 37px ≈ 2em</li>
          <li>H4: 18px / weight 600</li>
          <li>Inline code: 14px (0.875em) / 옅은 surface, border 0</li>
        </ul>
        <p>
          공식 H<sub>n</sub> = 16 × 1.286<sup>(4−n)</sup> 의 정량 ladder.
          <ins>2026-04 업데이트: 실측 확인 완료.</ins>{' '}
          <del>이전 안: clamp() fluid</del>는 폐기.
        </p>
      </section>

      <section id="tips">
        <h2>실용 팁 — 직접 만들 때 빠지기 쉬운 함정</h2>
        <details>
          <summary>1. 한국어에서 <code>text-wrap: balance</code>는 헤딩에만</summary>
          <p>
            본문 단락에 적용하면 마지막 줄을 줄여서 미관은 좋아지지만, 한국어는
            word boundary가 약해 어색하게 끊긴다. <code>text-wrap: pretty</code>로
            본문을 다루고, balance는 헤딩에만 쓴다.
          </p>
        </details>
        <details>
          <summary>2. <code>keep-all</code>과 <code>overflow-wrap: anywhere</code>의 조합</summary>
          <p>
            한국어 단어가 줄 끝에서 깨지지 않게 하려면 <code>word-break: keep-all</code>이
            필요하다. 그런데 긴 URL이나 식별자는 그대로 두면 컨테이너를 뚫고 나간다.
            <code>overflow-wrap: anywhere</code>를 함께 쓰면 한국어는 보존하면서
            긴 토큰만 깨진다.
          </p>
        </details>
        <details>
          <summary>3. <code>!important</code>는 거의 항상 잘못된 답</summary>
          <p>
            나타나는 순간 cascade layer 설계가 잘못됐다는 신호다. layer 순서를
            다시 보고, prose 같은 콘텐츠 도메인을 widget 도메인보다 뒤에 놓는다.
          </p>
        </details>
      </section>

      <hr />

      <footer>
        <nav aria-label="관련 문서">
          <p>
            <strong>관련 글</strong>:{' '}
            <a href="/canvas">Foundations · Components 자산 카탈로그 (Canvas)</a>
          </p>
        </nav>
        <p>
          <small>
            이 문서는 <code>article[data-flow="prose"]</code>의 시각 결정을 검증하는
            샘플이다. 모든 시맨틱 태그가 자연스러운 글 흐름 안에 등장한다 —
            카탈로그가 아니라 에세이.
          </small>
        </p>
        <address>
          작성자 연락처: <a href="mailto:developer.1px@gmail.com">developer.1px@gmail.com</a>
        </address>
      </footer>
    </>
  )
}
