import { css } from '../css'

/** @demo type=structural fn=listReset args=["ul"] */
export const listReset = (sel: string) => css`
  :where(${sel}) { list-style: none; margin: 0; padding: 0; }
`
