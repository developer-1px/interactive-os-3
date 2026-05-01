/**
 * Generated style contract — arbitrary className 금지의 반대편.
 *
 * 컴포넌트 스타일은 사람이 이름 붙인 class가 아니라 DS가 owner/slot/declaration으로
 * 생성한 class만 사용한다. tag/role/ARIA/data-slot selector는 이 class boundary
 * 아래에서만 세부 anatomy를 고른다.
 */
export type StyleContract<T extends Record<string, string>> = {
  owner: string
  classes: { readonly [K in keyof T]: string }
  css: string
}

const hash = (value: string) => {
  let output = 5381
  for (let i = 0; i < value.length; i += 1) {
    output = (output * 33) ^ value.charCodeAt(i)
  }
  return (output >>> 0).toString(36).slice(0, 6)
}

const safeIdent = (value: string) =>
  value.replace(/[^a-zA-Z0-9_-]/g, '-')

const createRule = (className: string, declaration: string) => {
  const selector = `.${className}`
  if (!declaration.includes('&')) return `${selector}{${declaration}}`

  const nestedRules: string[] = []
  const baseDeclaration = declaration
    .replace(/&[^{]*{[^}]*}/g, (block) => {
      nestedRules.push(block.replaceAll('&', selector))
      return ''
    })
    .trim()

  return `${baseDeclaration ? `${selector}{${baseDeclaration}}` : ''}${nestedRules.join('')}`
}

export function defineStyleContract<const T extends Record<string, string>>(
  owner: string,
  styles: T,
): StyleContract<T> {
  const classes = {} as { [K in keyof T]: string }
  const rules: string[] = []

  for (const [slot, declaration] of Object.entries(styles) as Array<[keyof T & string, string]>) {
    const className = `ds-${safeIdent(owner)}-${safeIdent(slot)}-${hash(`${owner}:${slot}:${declaration}`)}`
    classes[slot] = className
    rules.push(createRule(className, declaration))
  }

  return {
    owner,
    classes,
    css: rules.join('\n'),
  }
}
