export const roleCardContract = {
  name: 'RoleCard',
  kind: 'pattern',
  root: 'article',
  slots: ['preview', 'title', 'body', 'footer'] as const,
  actions: ['toggle-visible', 'edit', 'delete'] as const,
} as const
