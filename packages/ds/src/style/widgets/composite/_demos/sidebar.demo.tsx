/**
 * sidebar widget 데모 — nav[data-part="sidebar"] surface 의 raw markup 시연.
 * Tree 부착 없이 정적 마크업으로 토큰 적용 결과만 보인다.
 */
export default () => (
  <nav data-part="sidebar" aria-label="Demo sidebar" style={{ width: 220, height: 240 }}>
    <ul role="tree">
      <li role="treeitem" aria-selected="true"><span>Dashboard</span></li>
      <li role="treeitem"><span>Users</span></li>
      <li role="treeitem" aria-expanded="true">
        <span>Settings</span>
        <ul role="group">
          <li role="treeitem"><span>Profile</span></li>
          <li role="treeitem"><span>Billing</span></li>
        </ul>
      </li>
    </ul>
  </nav>
)
