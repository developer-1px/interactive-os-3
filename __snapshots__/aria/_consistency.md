# ARIA Consistency Report

Routes scanned: 21

## Role parent-pattern drift
한 role 이 여러 부모 패턴으로 쓰이면 책임 분산 의심.


## aria-label 사용률
같은 role 인데 한쪽은 aria 있고 한쪽은 없으면 일관성 갭.


## Required parent violations
(none)

## Hint frequency (printTree ⚠)
- 8× — single-child container — flatten?
  - in: epa-dashboard, epa-videos, epa-role-categories, epa-course-categories, epa-video-order, genres-shop, genres-analytics, genres-settings
- 4× — strong used as section header — should be h3?
  - in: genres, genres-board, genres-shop, genres-feed
- 1× — duplicates sibling aria-label
  - in: genres-shop
