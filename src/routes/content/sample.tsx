/**
 * Prose 시맨틱 태그 전수 카탈로그 — HTML5 8 카테고리 누락 0.
 * 1) sectioning  2) heading  3) text-level  4) lists  5) block  6) table  7) media  8) interactive
 * 각 섹션 id="html-<cat>" — sidebar/T3 anchor 진입점.
 * className·data-* 0건. raw 시맨틱 태그만으로 prose.ts 전수 검증.
 */
export function ProseSample() {
  return (
    <>
      <header>
        <hgroup>
          <h1>HTML5 시맨틱 전수 카탈로그</h1>
          <p>
            <small>MDN 기준 모든 컨텐츠 태그 — sectioning · heading · text · list · block · table · media · interactive.</small>
          </p>
        </hgroup>
        <p>
          이 문서는 ds의 <code>article[data-flow="prose"]</code>가 HTML5 시맨틱 태그
          전수를 시각적으로 일관되게 처리하는지 검증한다. 각 카테고리는{' '}
          <a href="#html-sectioning">앵커</a>로 직접 점프할 수 있다.
        </p>
        <address>
          작성: <a href="mailto:developer.1px@gmail.com">developer.1px@gmail.com</a> ·{' '}
          <time dateTime="2026-04-26">2026-04-26</time>
        </address>
      </header>

      {/* ─────────────── 1. SECTIONING ─────────────── */}
      <section id="html-sectioning">
        <h2>1. Sectioning &amp; document outline</h2>
        <p>
          문서 구조는 <code>&lt;main&gt;</code>·<code>&lt;article&gt;</code>·
          <code>&lt;section&gt;</code>·<code>&lt;nav&gt;</code>·<code>&lt;aside&gt;</code>·
          <code>&lt;header&gt;</code>·<code>&lt;footer&gt;</code>·<code>&lt;address&gt;</code>·
          <code>&lt;hgroup&gt;</code>로 outline을 구성한다.
        </p>

        <h3>1.1 article + header/footer</h3>
        <article>
          <header>
            <hgroup>
              <h4>중첩 article 헤더</h4>
              <p><small>2026-04-26 · prose 검증</small></p>
            </hgroup>
          </header>
          <p>이 <em>article</em>은 외부 article 안에 또 들어간 self-contained 컨텐츠 블록이다.</p>
          <footer>
            <p><small>article 푸터 — 라이선스/메타 정보가 들어간다.</small></p>
          </footer>
        </article>

        <h3>1.2 nav + aside</h3>
        <nav aria-label="섹션 내비게이션">
          <ol>
            <li><a href="#html-sectioning">Sectioning</a></li>
            <li><a href="#html-heading">Heading</a></li>
            <li><a href="#html-text">Text-level</a></li>
            <li><a href="#html-list">Lists</a></li>
            <li><a href="#html-block">Block</a></li>
            <li><a href="#html-table">Table</a></li>
            <li><a href="#html-media">Media</a></li>
            <li><a href="#html-interactive">Interactive</a></li>
          </ol>
        </nav>
        <aside>
          <p>
            <strong>Aside.</strong> 본문과 살짝 떨어진 보조 정보를 담는다 — 사이드바, 풋노트,
            저자 약력, pull quote 등.
          </p>
        </aside>
      </section>

      {/* ─────────────── 2. HEADING ─────────────── */}
      <section id="html-heading">
        <h2>2. Heading scale</h2>
        <p>h1~h6의 스케일이 modular scale 1.250(major third)로 단조 감소하는지 본다.</p>
        <h1>H1 — Page title (한 페이지 1개 권장)</h1>
        <h2>H2 — Major section</h2>
        <h3>H3 — Sub-section</h3>
        <h4>H4 — Detail</h4>
        <h5>H5 — Strong inline</h5>
        <h6>H6 — Microlabel</h6>
        <p>
          위계가 깊어질수록 폰트 크기는 줄지만 굵기는 유지되어 outline scanning이 가능해야 한다.
        </p>
      </section>

      {/* ─────────────── 3. TEXT-LEVEL ─────────────── */}
      <section id="html-text">
        <h2>3. Text-level (inline) semantics</h2>

        <h3>3.1 강조와 의미</h3>
        <p>
          <strong>강한 중요도(strong)</strong>와 <em>강조(em)</em>는 굵기·이탤릭으로 분리된다.
          <mark>형광펜(mark)</mark>은 검토 표시이고, <small>부가설명(small)</small>은 본문보다 작다.
          인용 출처는 <cite>『Don&apos;t Make Me Think』 — Steve Krug</cite>처럼 표기한다.
        </p>
        <p>
          짧은 인용은 <q>좋은 디자인은 보이지 않는다</q>처럼 <code>&lt;q&gt;</code>로 감싼다.
          축약어는 <abbr title="HyperText Markup Language">HTML</abbr>·
          <abbr title="Cascading Style Sheets">CSS</abbr>로, 정의어는{' '}
          <dfn>prose</dfn>는 산문체 본문 컨테이너를 의미한다.
        </p>

        <h3>3.2 코드·키보드·샘플</h3>
        <p>
          인라인 코드 <code>const x = 42</code>, 키보드 단축키 <kbd>Cmd</kbd>+<kbd>K</kbd>,
          프로그램 출력 <samp>Error: not found</samp>, 변수명 <var>x</var> +{' '}
          <var>y</var> = <var>z</var>.
        </p>

        <h3>3.3 시간·수학·하첨자/상첨자</h3>
        <p>
          출간일 <time dateTime="2026-04-26">2026년 4월 26일</time>. 화학식 H<sub>2</sub>O,
          수식 E = mc<sup>2</sup>. 줄바꿈이 가능한 긴 단어는<wbr />여기서 끊을 수 있다.
          하드 줄바꿈도<br />가능하다.
        </p>

        <h3>3.4 수정 이력</h3>
        <p>
          가격은 <del>$30</del> <ins>$25</ins>로 변경되었다. 취소된 항목은{' '}
          <s>옛 표기</s>, 고유명사 강조는 <u>밑줄</u>로 표시한다.
        </p>

        <h3>3.5 양방향 텍스트</h3>
        <p>
          BiDi 분리: 사용자 이름은 <bdi>إيان</bdi> — 232 points. 강제 방향:{' '}
          <bdo dir="rtl">this text is RTL</bdo>.
        </p>

        <h3>3.6 링크와 generic span</h3>
        <p>
          외부 링크는 <a href="https://developer.mozilla.org/">MDN</a>으로,
          내부 anchor는 <a href="#html-table">테이블 섹션</a>으로 이동한다.{' '}
          <span>span</span>은 의미 없는 inline wrapper로, 직접 스타일이 필요할 때만 쓴다.
        </p>
      </section>

      {/* ─────────────── 4. LISTS ─────────────── */}
      <section id="html-list">
        <h2>4. Lists</h2>

        <h3>4.1 Unordered &amp; nested</h3>
        <ul>
          <li>flat item.</li>
          <li>
            중첩 부모
            <ul>
              <li>중첩 자식 1</li>
              <li>
                중첩 손자
                <ul>
                  <li>3단 중첩</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>마지막 flat item.</li>
        </ul>

        <h3>4.2 Ordered with start / reversed / type</h3>
        <ol start={3}>
          <li>세 번째부터 시작.</li>
          <li value={10}>건너뛰어 10번.</li>
          <li>11번.</li>
        </ol>
        <ol reversed type="A">
          <li>A 역순 첫 항목.</li>
          <li>다음 항목.</li>
          <li>마지막.</li>
        </ol>

        <h3>4.3 Description list</h3>
        <dl>
          <dt>Tracking</dt>
          <dd>letter-spacing의 동의어 — preset에서 일괄 결정.</dd>
          <dt>Leading</dt>
          <dd>line-height — tight/normal/loose 3단.</dd>
          <dt>Weight</dt>
          <dd>regular(400) / medium(500) / semibold(600) / bold(700).</dd>
        </dl>

        <h3>4.4 Menu (toolbar 의미)</h3>
        <menu>
          <li><button type="button">복사</button></li>
          <li><button type="button">붙여넣기</button></li>
          <li><button type="button">삭제</button></li>
        </menu>
      </section>

      {/* ─────────────── 5. BLOCK ─────────────── */}
      <section id="html-block">
        <h2>5. Block content</h2>

        <h3>5.1 Paragraph + horizontal rule</h3>
        <p>일반 단락. 상단·하단 vertical rhythm을 prose가 일괄 적용한다.</p>
        <hr />
        <p>hr 다음 단락 — 의미적 구분 후 새 흐름.</p>

        <h3>5.2 Blockquote with cite</h3>
        <blockquote cite="https://www.goodreads.com/quotes/9010">
          <p>
            “Design is not just what it looks like and feels like. Design is how it works.”
          </p>
          <footer>
            — <cite>Steve Jobs</cite>
          </footer>
        </blockquote>

        <h3>5.3 Pre &amp; code block</h3>
        <pre>
          <code>{`function greet(name: string) {
  return \`hello, \${name}\`
}

greet('world')`}</code>
        </pre>

        <h3>5.4 Figure + figcaption</h3>
        <figure>
          <pre><code>{`[data-flow="prose"] {
  --prose-body: 16.5px;
  --prose-leading: 1.7;
}`}</code></pre>
          <figcaption>prose 핵심 변수 — body size와 leading.</figcaption>
        </figure>
      </section>

      {/* ─────────────── 6. TABLE ─────────────── */}
      <section id="html-table">
        <h2>6. Table</h2>
        <p>비교용 데이터 — caption / thead / tbody / tfoot / colgroup 전수.</p>
        <table>
          <caption>Typography 토큰 비교</caption>
          <colgroup>
            <col span={1} />
            <col span={2} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
              <th scope="col">Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><code>leading(&apos;tight&apos;)</code></th>
              <td>1.25</td>
              <td>Heading 전용 — 위계 강조.</td>
            </tr>
            <tr>
              <th scope="row"><code>leading(&apos;normal&apos;)</code></th>
              <td>1.5</td>
              <td>UI 기본값 — chrome / 컨트롤.</td>
            </tr>
            <tr>
              <th scope="row"><code>leading(&apos;loose&apos;)</code></th>
              <td>1.75</td>
              <td>Prose body — 가독성 우선.</td>
            </tr>
            <tr>
              <th scope="row" rowSpan={2}><code>weight</code></th>
              <td>400</td>
              <td>regular — 본문 기본.</td>
            </tr>
            <tr>
              <td>600</td>
              <td>semibold — strong, dt.</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}><small>출처: ds/foundations · 2026-04 기준.</small></td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* ─────────────── 7. MEDIA ─────────────── */}
      <section id="html-media">
        <h2>7. Embedded &amp; media</h2>

        <h3>7.1 Image (img + picture + source)</h3>
        <figure>
          <picture>
            <source media="(min-width: 800px)" srcSet="https://placehold.co/800x320/png" />
            <source media="(min-width: 400px)" srcSet="https://placehold.co/400x160/png" />
            <img
              src="https://placehold.co/200x80/png"
              alt="크기별 picture/source — 반응형 이미지 예시"
              width={200}
              height={80}
            />
          </picture>
          <figcaption>picture / source / img — viewport에 따라 자동 선택.</figcaption>
        </figure>

        <h3>7.2 Inline SVG</h3>
        <figure>
          <svg width="120" height="40" viewBox="0 0 120 40" role="img" aria-label="ds 로고 placeholder">
            <rect x="0" y="0" width="120" height="40" fill="currentColor" opacity="0.08" />
            <text x="60" y="26" textAnchor="middle" fontSize="16" fill="currentColor">ds/svg</text>
          </svg>
          <figcaption>inline SVG — currentColor를 그대로 받아 다크 모드 자동 대응.</figcaption>
        </figure>

        <h3>7.3 Audio &amp; video</h3>
        <p>
          <audio controls>
            <source src="https://example.com/audio.mp3" type="audio/mpeg" />
            audio 태그를 지원하지 않는 브라우저용 폴백 텍스트.
          </audio>
        </p>
        <p>
          <video controls width={320} height={180} poster="https://placehold.co/320x180/png">
            <source src="https://example.com/video.mp4" type="video/mp4" />
            video 태그를 지원하지 않는 브라우저용 폴백 텍스트.
          </video>
        </p>

        <h3>7.4 Iframe &amp; canvas</h3>
        <p>
          외부 임베드는 <code>&lt;iframe&gt;</code>으로:
        </p>
        <iframe
          src="about:blank"
          title="빈 iframe 데모"
          width={320}
          height={120}
        />
        <p>
          비트맵 그리기는 <code>&lt;canvas&gt;</code> — 스크립트로 그린다:
        </p>
        <canvas width={320} height={80} aria-label="canvas placeholder">
          canvas를 지원하지 않는 브라우저용 폴백.
        </canvas>

        <h3>7.5 Image map (map + area)</h3>
        <p>
          <img
            src="https://placehold.co/240x80/png"
            alt="클릭 가능 영역이 있는 이미지"
            width={240}
            height={80}
            useMap="#prose-demo-map"
          />
        </p>
        <map name="prose-demo-map">
          <area shape="rect" coords="0,0,120,80" href="#html-text" alt="텍스트 섹션으로" />
          <area shape="rect" coords="120,0,240,80" href="#html-table" alt="테이블 섹션으로" />
        </map>
      </section>

      {/* ─────────────── 8. INTERACTIVE ─────────────── */}
      <section id="html-interactive">
        <h2>8. Interactive &amp; details</h2>

        <h3>8.1 Details / summary</h3>
        <details>
          <summary>접힌 패널을 펼쳐 본다 (summary)</summary>
          <p>펼쳤을 때 보이는 본문. <strong>details</strong>는 native disclosure다.</p>
        </details>
        <details open>
          <summary>기본 펼침(open) 상태</summary>
          <p>open 속성이 붙으면 첫 렌더부터 펼쳐 있다.</p>
        </details>

        <h3>8.2 Dialog (언급)</h3>
        <p>
          모달은 <code>&lt;dialog&gt;</code> + <code>showModal()</code>로 native하게 구현한다.
          데모는 별도 라우트에서 검증.
        </p>

        <h3>8.3 Button vs link</h3>
        <p>
          <button type="button">button</button>은 액션 트리거,{' '}
          <a href="#html-sectioning">a</a>는 내비게이션이다. 의미가 다르므로 절대 혼용하지 않는다.
        </p>

        <h3>8.4 Output / progress / meter</h3>
        <p>
          계산 결과는 <output>42</output>처럼 노출한다. 작업 진행도는{' '}
          <progress value={70} max={100}>70%</progress>, 정량 측정값은{' '}
          <meter value={0.6} min={0} max={1} low={0.3} high={0.8} optimum={0.9}>60%</meter>로.
        </p>

        <h3>8.5 Form 전수</h3>
        <form>
          <fieldset>
            <legend>계정 정보</legend>

            <p>
              <label htmlFor="prose-name">이름</label>{' '}
              <input id="prose-name" name="name" type="text" placeholder="홍길동" />
            </p>

            <p>
              <label htmlFor="prose-email">이메일</label>{' '}
              <input id="prose-email" name="email" type="email" placeholder="you@example.com" />
            </p>

            <p>
              <label htmlFor="prose-pw">비밀번호</label>{' '}
              <input id="prose-pw" name="pw" type="password" />
            </p>

            <p>
              <label htmlFor="prose-age">나이</label>{' '}
              <input id="prose-age" name="age" type="number" min={0} max={120} defaultValue={30} />
            </p>

            <p>
              <label htmlFor="prose-when">날짜</label>{' '}
              <input id="prose-when" name="when" type="date" />
            </p>

            <p>
              <label htmlFor="prose-color">색</label>{' '}
              <input id="prose-color" name="color" type="color" defaultValue="#3366ff" />
            </p>

            <p>
              <label htmlFor="prose-range">볼륨</label>{' '}
              <input id="prose-range" name="vol" type="range" min={0} max={100} defaultValue={50} />
            </p>

            <p>
              <label>
                <input type="checkbox" name="agree" /> 약관 동의
              </label>
            </p>

            <p>
              <label><input type="radio" name="plan" value="free" defaultChecked /> Free</label>{' '}
              <label><input type="radio" name="plan" value="pro" /> Pro</label>{' '}
              <label><input type="radio" name="plan" value="team" /> Team</label>
            </p>
          </fieldset>

          <fieldset>
            <legend>선택형</legend>

            <p>
              <label htmlFor="prose-country">국가</label>{' '}
              <select id="prose-country" name="country">
                <optgroup label="아시아">
                  <option value="kr">대한민국</option>
                  <option value="jp">일본</option>
                </optgroup>
                <optgroup label="유럽">
                  <option value="de">독일</option>
                  <option value="fr">프랑스</option>
                </optgroup>
              </select>
            </p>

            <p>
              <label htmlFor="prose-browser">브라우저 (datalist)</label>{' '}
              <input id="prose-browser" name="browser" list="prose-browsers" />
              <datalist id="prose-browsers">
                <option value="Chrome" />
                <option value="Firefox" />
                <option value="Safari" />
                <option value="Edge" />
              </datalist>
            </p>

            <p>
              <label htmlFor="prose-bio">소개</label><br />
              <textarea id="prose-bio" name="bio" rows={3} cols={40} placeholder="짧은 자기소개..." />
            </p>
          </fieldset>

          <p>
            <button type="submit">제출</button>{' '}
            <button type="reset">초기화</button>
          </p>
        </form>
      </section>

      {/* ─────────────── 9. ARIA — LANDMARK ─────────────── */}
      <section id="aria-landmark">
        <h2>9. ARIA — Landmark roles</h2>
        <p>
          페이지 골격을 보조기술에게 알리는 8개 landmark. HTML5 시맨틱 태그가 implicit role을
          이미 갖고 있으니 author는 그쪽을 우선하고, role은 generic 컨테이너에 의미를 입힐 때만 쓴다.
        </p>

        <h3>9.1 banner / contentinfo</h3>
        <div role="banner" aria-label="페이지 머리말 데모">
          <p><strong>banner</strong> — 페이지 최상단 사이트-와이드 머리말. <code>&lt;header&gt;</code>가 body 직속이면 implicit.</p>
        </div>
        <div role="contentinfo" aria-label="페이지 꼬리말 데모">
          <p><strong>contentinfo</strong> — 사이트-와이드 꼬리말. <code>&lt;footer&gt;</code>가 body 직속이면 implicit.</p>
        </div>

        <h3>9.2 navigation / main / complementary</h3>
        <div role="navigation" aria-label="ARIA 카탈로그 내비">
          <ol>
            <li><a href="#aria-landmark">Landmark</a></li>
            <li><a href="#aria-document">Document structure</a></li>
            <li><a href="#aria-widget">Widget</a></li>
            <li><a href="#aria-live">Live region</a></li>
            <li><a href="#aria-window">Window</a></li>
            <li><a href="#aria-abstract">Abstract &amp; mapping</a></li>
          </ol>
        </div>
        <div role="main" aria-label="주요 컨텐츠 영역 데모">
          <p><strong>main</strong> — 페이지의 주요 컨텐츠. 1개만 권장.</p>
        </div>
        <div role="complementary" aria-label="보조 정보">
          <p><strong>complementary</strong> — 본문과 분리된 보조 컨텐츠. <code>&lt;aside&gt;</code> 동치.</p>
        </div>

        <h3>9.3 region / search / form</h3>
        <div role="region" aria-labelledby="aria-region-heading">
          <h4 id="aria-region-heading">독립 region</h4>
          <p><strong>region</strong> — 이름이 있을 때만 landmark가 된다 (<code>aria-labelledby</code>/<code>aria-label</code> 필수).</p>
        </div>
        <div role="search" aria-label="검색 영역 데모">
          <input type="search" placeholder="검색어..." aria-label="검색어 입력" />
          <button type="button">찾기</button>
        </div>
        <div role="form" aria-label="구독 폼 데모">
          <label htmlFor="aria-form-email">이메일</label>{' '}
          <input id="aria-form-email" type="email" />
        </div>
      </section>

      {/* ─────────────── 10. ARIA — DOCUMENT STRUCTURE ─────────────── */}
      <section id="aria-document">
        <h2>10. ARIA — Document structure roles</h2>
        <p>
          비대화형 컨텐츠 시맨틱. HTML 시맨틱 태그가 대부분 implicit으로 갖고 있어
          author 사용은 generic 마크업에 의미를 부여할 때 한정한다.
        </p>

        <h3>10.1 article / document / application / feed</h3>
        <div role="article">
          <h4>article role</h4>
          <p>self-contained 컨텐츠 단위.</p>
        </div>
        <div role="document">
          <p><strong>document</strong> — application 컨텍스트 안에서 reading 모드를 강제할 때.</p>
        </div>
        <div role="application" aria-label="커스텀 캔버스 데모">
          <p><strong>application</strong> — 표준 키보드 모델을 끄고 author가 모든 키를 직접 처리. 신중히 사용.</p>
        </div>
        <div role="feed" aria-label="무한 피드 데모" aria-busy="false">
          <article aria-posinset={1} aria-setsize={3}><p>피드 항목 1</p></article>
          <article aria-posinset={2} aria-setsize={3}><p>피드 항목 2</p></article>
          <article aria-posinset={3} aria-setsize={3}><p>피드 항목 3</p></article>
        </div>

        <h3>10.2 list / listitem / directory (deprecated)</h3>
        <div role="list">
          <div role="listitem">listitem 1</div>
          <div role="listitem">listitem 2</div>
        </div>
        <div role="directory" aria-label="directory (deprecated — list로 대체)">
          <div role="listitem">deprecated 직책 표</div>
        </div>

        <h3>10.3 figure / img / math / note / definition / term</h3>
        <div role="figure" aria-label="figure role">
          <div role="img" aria-label="img role placeholder">[ img ]</div>
          <p><span role="math" aria-label="이 분의 일">½</span> = 0.5</p>
        </div>
        <p role="note">note — 부가설명/사이드 노트.</p>
        <p>
          <span role="term" id="aria-term-prose">prose</span>{' '}
          <span role="definition" aria-labelledby="aria-term-prose">— 산문체 본문 컨테이너.</span>
        </p>

        <h3>10.4 group / toolbar / separator / tooltip / heading</h3>
        <div role="group" aria-label="버튼 그룹">
          <button type="button">A</button>
          <button type="button">B</button>
        </div>
        <div role="toolbar" aria-label="툴바 데모">
          <button type="button">Bold</button>
          <button type="button">Italic</button>
          <span role="separator" aria-orientation="vertical">|</span>
          <button type="button">Link</button>
        </div>
        <hr role="separator" aria-orientation="horizontal" />
        <div>
          <button type="button" aria-describedby="aria-tip-1">호버하면 설명</button>
          <span role="tooltip" id="aria-tip-1">이게 tooltip 본문</span>
        </div>
        <div role="heading" aria-level={3}>div 위에 얹은 heading role (level=3)</div>

        <h3>10.5 presentation / none / generic</h3>
        <ul role="presentation">
          <li role="none">presentation/none — 시맨틱 제거. 시각용 레이아웃 wrapper에 한정.</li>
        </ul>
        <div role="generic">generic — 의미 없는 컨테이너. <code>&lt;div&gt;</code>의 implicit.</div>

        <h3>10.6 association list (DL 대응)</h3>
        <dl role="associationlist">
          <dt role="associationlistitemkey">Key</dt>
          <dd role="associationlistitemvalue">Value</dd>
        </dl>

        <h3>10.7 inline 의미 — code / emphasis / strong / mark / time / paragraph</h3>
        <p role="paragraph">
          <span role="code">const x = 42</span> ·{' '}
          <span role="emphasis">emphasis</span> · <span role="strong">strong</span> ·{' '}
          <span role="mark">mark</span> ·{' '}
          <span role="time">2026-04-26</span>
        </p>

        <h3>10.8 변경 이력 — deletion / insertion / suggestion / comment</h3>
        <p>
          <span role="deletion">옛 텍스트</span>{' '}
          <span role="insertion">새 텍스트</span>
        </p>
        <div role="suggestion">
          <span role="deletion">$30</span> <span role="insertion">$25</span>
        </div>
        <div role="comment" aria-label="리뷰 댓글">
          <p>리뷰어 코멘트 본문 — comment role.</p>
        </div>

        <h3>10.9 인용 / 캡션 / 첨자</h3>
        <div role="blockquote">
          <p>“Design is how it works.”</p>
        </div>
        <table>
          <caption role="caption">caption role 데모</caption>
          <tbody><tr><td>cell</td></tr></tbody>
        </table>
        <p>
          H<span role="subscript">2</span>O · E = mc<span role="superscript">2</span>
        </p>

        <h3>10.10 meter (정량 게이지)</h3>
        <div role="meter" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-label="저장 사용률">
          60%
        </div>
      </section>

      {/* ─────────────── 11. ARIA — WIDGET ─────────────── */}
      <section id="aria-widget">
        <h2>11. ARIA — Widget roles</h2>
        <p>
          대화형 컨트롤. 상태(<code>aria-checked</code>, <code>aria-selected</code>,{' '}
          <code>aria-expanded</code>)와 키보드 모델이 함께 와야 의미가 산다.
        </p>

        <h3>11.1 단일 컨트롤 — button / link / checkbox / radio / switch</h3>
        <p>
          <span role="button" tabIndex={0}>div-button</span>{' '}
          <span role="link" tabIndex={0}>div-link</span>{' '}
          <span role="checkbox" tabIndex={0} aria-checked="true">☑ 동의</span>{' '}
          <span role="checkbox" tabIndex={0} aria-checked="mixed">▣ 부분</span>{' '}
          <span role="switch" tabIndex={0} aria-checked="false">OFF</span>
        </p>
        <div role="radiogroup" aria-label="플랜 선택">
          <span role="radio" tabIndex={0} aria-checked="true">Free</span>{' '}
          <span role="radio" tabIndex={-1} aria-checked="false">Pro</span>{' '}
          <span role="radio" tabIndex={-1} aria-checked="false">Team</span>
        </div>

        <h3>11.2 textbox / searchbox / combobox / option / listbox</h3>
        <div role="textbox" tabIndex={0} contentEditable="true" aria-label="멀티라인 텍스트박스" aria-multiline="true">
          타이핑 가능한 div
        </div>
        <div role="searchbox" tabIndex={0} contentEditable="true" aria-label="검색어">검색어</div>
        <div>
          <input
            role="combobox"
            type="text"
            aria-expanded="true"
            aria-controls="aria-listbox-demo"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-label="국가 검색"
          />
          <ul role="listbox" id="aria-listbox-demo" aria-label="국가">
            <li role="option" aria-selected="true">대한민국</li>
            <li role="option" aria-selected="false">일본</li>
            <li role="option" aria-selected="false">독일</li>
          </ul>
        </div>

        <h3>11.3 menu / menubar / menuitem / menuitemcheckbox / menuitemradio</h3>
        <div role="menubar" aria-label="앱 메뉴바">
          <span role="menuitem" tabIndex={0} aria-haspopup="menu" aria-expanded="false">파일</span>
          <span role="menuitem" tabIndex={-1}>편집</span>
          <span role="menuitem" tabIndex={-1}>보기</span>
        </div>
        <div role="menu" aria-label="컨텍스트 메뉴">
          <div role="menuitem" tabIndex={-1}>새로 만들기</div>
          <div role="menuitemcheckbox" tabIndex={-1} aria-checked="true">자동 저장</div>
          <div role="menuitemradio" tabIndex={-1} aria-checked="true" aria-label="정렬 이름">이름순</div>
          <div role="menuitemradio" tabIndex={-1} aria-checked="false" aria-label="정렬 날짜">날짜순</div>
          <div role="separator"></div>
          <div role="menuitem" tabIndex={-1} aria-disabled="true">잘라내기</div>
        </div>

        <h3>11.4 tablist / tab / tabpanel</h3>
        <div role="tablist" aria-label="설정 탭">
          <span role="tab" tabIndex={0} aria-selected="true" aria-controls="aria-tp-1" id="aria-t-1">일반</span>
          <span role="tab" tabIndex={-1} aria-selected="false" aria-controls="aria-tp-2" id="aria-t-2">알림</span>
        </div>
        <div role="tabpanel" id="aria-tp-1" aria-labelledby="aria-t-1">
          <p>일반 설정 패널.</p>
        </div>
        <div role="tabpanel" id="aria-tp-2" aria-labelledby="aria-t-2" hidden>
          <p>알림 설정 패널.</p>
        </div>

        <h3>11.5 tree / treeitem / treegrid</h3>
        <ul role="tree" aria-label="파일 트리">
          <li role="treeitem" aria-expanded="true">
            src
            <ul role="group">
              <li role="treeitem" aria-expanded="false" aria-selected="true">routes</li>
              <li role="treeitem" aria-expanded="false">ds</li>
            </ul>
          </li>
        </ul>
        <table role="treegrid" aria-label="treegrid 데모">
          <tbody>
            <tr role="row" aria-level={1} aria-expanded="true">
              <td role="gridcell">루트</td><td role="gridcell">2026-04-26</td>
            </tr>
            <tr role="row" aria-level={2}>
              <td role="gridcell">자식</td><td role="gridcell">2026-04-25</td>
            </tr>
          </tbody>
        </table>

        <h3>11.6 grid / row / gridcell / rowheader / columnheader</h3>
        <table role="grid" aria-label="스프레드시트 grid">
          <thead>
            <tr role="row">
              <th role="columnheader">A</th>
              <th role="columnheader">B</th>
            </tr>
          </thead>
          <tbody>
            <tr role="row">
              <th role="rowheader">1</th>
              <td role="gridcell" tabIndex={0}>=A1+1</td>
            </tr>
          </tbody>
        </table>

        <h3>11.7 slider / spinbutton / scrollbar / progressbar</h3>
        <div
          role="slider"
          tabIndex={0}
          aria-label="볼륨"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          aria-valuetext="50 percent"
        >
          ━━●━━
        </div>
        <div role="spinbutton" tabIndex={0} aria-valuemin={0} aria-valuemax={120} aria-valuenow={30} aria-label="나이">
          30
        </div>
        <div
          role="scrollbar"
          tabIndex={0}
          aria-controls="aria-scroll-target"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={20}
        >
          ▌
        </div>
        <div id="aria-scroll-target">scroll target</div>
        <div role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100} aria-label="업로드">
          70%
        </div>

        <h3>11.8 separator (focusable splitter)</h3>
        <div
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={40}
          aria-label="패널 splitter"
        >
          │
        </div>
      </section>

      {/* ─────────────── 12. ARIA — LIVE REGION ─────────────── */}
      <section id="aria-live">
        <h2>12. ARIA — Live region roles</h2>
        <p>
          비동기로 바뀌는 컨텐츠를 보조기술에게 announce 한다. 정중함은{' '}
          <code>aria-live="polite|assertive|off"</code>, 원자성은{' '}
          <code>aria-atomic</code>으로 결정.
        </p>

        <h3>12.1 status / log / alert</h3>
        <div role="status" aria-live="polite" aria-atomic="true">
          저장됨 — 2초 전.
        </div>
        <div role="log" aria-live="polite" aria-relevant="additions">
          <p>[10:00] 시작</p>
          <p>[10:01] 진행중</p>
        </div>
        <div role="alert" aria-live="assertive" aria-atomic="true">
          오류 — 네트워크 연결을 확인하세요.
        </div>

        <h3>12.2 timer / marquee</h3>
        <div role="timer" aria-live="off" aria-label="남은 시간">02:30</div>
        <div role="marquee" aria-live="off" aria-label="공지 마퀴">속보 — 카탈로그 6 카테고리 추가.</div>

        <h3>12.3 progressbar (live 측면)</h3>
        <div
          role="progressbar"
          aria-busy="true"
          aria-valuenow={42}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="다운로드"
        >
          42%
        </div>
      </section>

      {/* ─────────────── 13. ARIA — WINDOW ─────────────── */}
      <section id="aria-window">
        <h2>13. ARIA — Window roles</h2>
        <p>
          모달·다이얼로그. 포커스 트랩과 <code>aria-modal="true"</code>가 핵심.
          native <code>&lt;dialog&gt;</code>가 있으면 그걸 우선한다.
        </p>

        <h3>13.1 dialog</h3>
        <div role="dialog" aria-modal="true" aria-labelledby="aria-dlg-title" aria-describedby="aria-dlg-desc">
          <h4 id="aria-dlg-title">설정 저장</h4>
          <p id="aria-dlg-desc">변경사항을 저장하시겠습니까?</p>
          <button type="button">저장</button>
          <button type="button">취소</button>
        </div>

        <h3>13.2 alertdialog</h3>
        <div role="alertdialog" aria-modal="true" aria-labelledby="aria-adlg-title" aria-describedby="aria-adlg-desc">
          <h4 id="aria-adlg-title">파일 삭제</h4>
          <p id="aria-adlg-desc">정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          <button type="button">삭제</button>
          <button type="button">취소</button>
        </div>
      </section>

      {/* ─────────────── 14. ARIA — ABSTRACT & MAPPING ─────────────── */}
      <section id="aria-abstract">
        <h2>14. ARIA — Abstract roles &amp; HTML mapping</h2>

        <h3>14.1 Abstract roles (author 사용 금지)</h3>
        <p>
          Spec 분류 목적의 추상 role — 마크업에 직접 쓰면 무시된다. 참고용 나열:
        </p>
        <ul>
          <li><code>command</code> (button·menuitem·link 부모)</li>
          <li><code>composite</code> (combobox·grid·listbox·menu·tablist·tree 부모)</li>
          <li><code>input</code> (checkbox·radio·textbox 부모)</li>
          <li><code>landmark</code> (banner·main·navigation 부모)</li>
          <li><code>range</code> (meter·progressbar·slider·spinbutton 부모)</li>
          <li><code>roletype</code> (모든 role의 루트)</li>
          <li><code>section</code> (cell·figure·list·table 부모)</li>
          <li><code>sectionhead</code> (heading·tab 부모)</li>
          <li><code>select</code> (combobox·listbox·menu·tree 부모)</li>
          <li><code>structure</code> (document·section 부모)</li>
          <li><code>widget</code> (button·input·composite 부모)</li>
          <li><code>window</code> (dialog·alertdialog 부모)</li>
        </ul>

        <h3>14.2 HTML ↔ implicit ARIA role 매핑</h3>
        <p>
          author 우선순위: <strong>HTML 시맨틱 태그 &gt; role 속성</strong>. role은 native 태그가
          없거나 generic 컨테이너에 의미를 입혀야 할 때만.
        </p>
        <table>
          <caption>HTML 태그 ↔ implicit ARIA role</caption>
          <thead>
            <tr>
              <th scope="col">HTML</th>
              <th scope="col">Implicit role</th>
              <th scope="col">권장</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row"><code>&lt;header&gt;</code> (body 직속)</th><td>banner</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;footer&gt;</code> (body 직속)</th><td>contentinfo</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;nav&gt;</code></th><td>navigation</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;main&gt;</code></th><td>main</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;aside&gt;</code></th><td>complementary</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;section&gt;</code> (named)</th><td>region</td><td>aria-labelledby 부착</td></tr>
            <tr><th scope="row"><code>&lt;article&gt;</code></th><td>article</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;form&gt;</code> (named)</th><td>form</td><td>aria-label 권장</td></tr>
            <tr><th scope="row"><code>&lt;search&gt;</code></th><td>search</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;h1&gt;–&lt;h6&gt;</code></th><td>heading (level=1..6)</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;hr&gt;</code></th><td>separator</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;p&gt;</code></th><td>paragraph</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;blockquote&gt;</code></th><td>blockquote</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;figure&gt;</code></th><td>figure</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;img alt&gt;</code></th><td>img</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;img alt=""&gt;</code></th><td>presentation</td><td>장식 이미지에만</td></tr>
            <tr><th scope="row"><code>&lt;svg&gt;</code></th><td>graphics-document</td><td>role="img" + aria-label</td></tr>
            <tr><th scope="row"><code>&lt;ul&gt;</code></th><td>list</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;ol&gt;</code></th><td>list</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;li&gt;</code></th><td>listitem</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;dl&gt;</code></th><td>(no role) / associationlist</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;table&gt;</code></th><td>table</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;caption&gt;</code></th><td>caption</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;tr&gt;</code></th><td>row</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;th scope="col"&gt;</code></th><td>columnheader</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;th scope="row"&gt;</code></th><td>rowheader</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;td&gt;</code></th><td>cell (or gridcell in grid)</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;button&gt;</code></th><td>button</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;a href&gt;</code></th><td>link</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;input type="checkbox"&gt;</code></th><td>checkbox</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;input type="radio"&gt;</code></th><td>radio</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;input type="text"&gt;</code></th><td>textbox</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;input type="search"&gt;</code></th><td>searchbox</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;input type="number"&gt;</code></th><td>spinbutton</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;input type="range"&gt;</code></th><td>slider</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;textarea&gt;</code></th><td>textbox (multiline)</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;select&gt;</code></th><td>combobox / listbox</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;option&gt;</code></th><td>option</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;progress&gt;</code></th><td>progressbar</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;meter&gt;</code></th><td>meter</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;output&gt;</code></th><td>status</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;dialog&gt;</code></th><td>dialog</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;details&gt;</code></th><td>group (disclosure)</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;summary&gt;</code></th><td>button (disclosure)</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;time&gt;</code></th><td>time</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;mark&gt;</code></th><td>mark</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;code&gt;</code></th><td>code</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;em&gt;</code></th><td>emphasis</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;strong&gt;</code></th><td>strong</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;ins&gt;</code></th><td>insertion</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;del&gt;</code></th><td>deletion</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;sub&gt;</code></th><td>subscript</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;sup&gt;</code></th><td>superscript</td><td>그대로 사용</td></tr>
            <tr><th scope="row"><code>&lt;div&gt;</code></th><td>generic</td><td>의미 없는 wrapper</td></tr>
            <tr><th scope="row"><code>&lt;span&gt;</code></th><td>generic</td><td>의미 없는 inline</td></tr>
          </tbody>
        </table>
      </section>

      {/* ─────────────── 15. ARIA — STATES & PROPERTIES ─────────────── */}
      <section id="aria-attributes">
        <h2>15. ARIA — States &amp; Properties 시연</h2>
        <p>
          role 못지않게 중요한 게 속성. 상태(state)는 동적으로 바뀌고, 프로퍼티(property)는
          정적이다. 아래는 자주 쓰는 12종.
        </p>

        <h3>15.1 이름과 설명 — label / labelledby / describedby</h3>
        <button type="button" aria-label="닫기">×</button>{' '}
        <button type="button" aria-labelledby="aria-attr-l1">저장</button>
        <span id="aria-attr-l1" hidden>설정 저장</span>{' '}
        <button type="button" aria-describedby="aria-attr-d1">제출</button>
        <span id="aria-attr-d1"><small>제출하면 영구 저장됩니다.</small></span>

        <h3>15.2 상태 — expanded / selected / checked / pressed / current / disabled</h3>
        <p>
          <button type="button" aria-expanded="true" aria-controls="aria-attr-panel">▼ 패널</button>{' '}
          <button type="button" aria-pressed="true">고정됨</button>{' '}
          <span role="checkbox" tabIndex={0} aria-checked="false">미체크</span>{' '}
          <a href="#aria-attributes" aria-current="page">현재 페이지</a>{' '}
          <button type="button" aria-disabled="true">비활성</button>
        </p>
        <div id="aria-attr-panel">expanded 패널 본문</div>

        <h3>15.3 가시성 — hidden / busy / live / atomic / relevant</h3>
        <p>
          <span aria-hidden="true">🔒</span> 자물쇠 아이콘은 SR에 숨김.
        </p>
        <div aria-busy="true" aria-live="polite" aria-atomic="true" aria-relevant="additions text">
          로딩중 — 잠시 기다려주세요.
        </div>

        <h3>15.4 관계 — controls / owns / haspopup / activedescendant</h3>
        <input
          type="text"
          aria-controls="aria-attr-results"
          aria-owns="aria-attr-results"
          aria-haspopup="listbox"
          aria-activedescendant="aria-attr-opt-2"
          aria-label="자동완성"
        />
        <ul id="aria-attr-results" role="listbox">
          <li role="option" id="aria-attr-opt-1">옵션 1</li>
          <li role="option" id="aria-attr-opt-2" aria-selected="true">옵션 2</li>
          <li role="option" id="aria-attr-opt-3">옵션 3</li>
        </ul>

        <h3>15.5 값 — valuenow / valuemin / valuemax / valuetext</h3>
        <div
          role="slider"
          tabIndex={0}
          aria-valuenow={75}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext="75 percent — high"
          aria-label="밝기"
        >
          밝기: 75%
        </div>

        <h3>15.6 입력 보조 — required / invalid / readonly / placeholder / autocomplete</h3>
        <p>
          <label htmlFor="aria-attr-req">이메일 *</label>{' '}
          <input
            id="aria-attr-req"
            type="email"
            aria-required="true"
            aria-invalid="true"
            aria-errormessage="aria-attr-err"
            aria-autocomplete="inline"
            aria-readonly="false"
          />
          <span id="aria-attr-err" role="alert">올바른 이메일이 아닙니다.</span>
        </p>

        <h3>15.7 위치 — posinset / setsize / level / orientation / sort</h3>
        <ul role="list">
          <li role="listitem" aria-posinset={1} aria-setsize={3} aria-level={1}>1/3</li>
          <li role="listitem" aria-posinset={2} aria-setsize={3} aria-level={1}>2/3</li>
          <li role="listitem" aria-posinset={3} aria-setsize={3} aria-level={1}>3/3</li>
        </ul>
        <table>
          <thead>
            <tr>
              <th scope="col" aria-sort="ascending">이름 ▲</th>
              <th scope="col" aria-sort="none">날짜</th>
            </tr>
          </thead>
          <tbody><tr><td>—</td><td>—</td></tr></tbody>
        </table>
      </section>

      <footer>
        <p>
          <small>
            끝. HTML5 시맨틱 8 + ARIA 6 + 매핑 + 속성 시연 — 16 카테고리 모두 정상 렌더되면
            prose.ts가 시맨틱·접근성 어휘 전수를 커버한다는 뜻이다.
          </small>
        </p>
      </footer>
    </>
  )
}
