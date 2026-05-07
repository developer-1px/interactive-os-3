import { useZodCrudResource } from '@p/aria-kernel/adapters/zod-crud'
import { outlinerSpec } from './outliner.spec'
import { resource } from './resource'
import { normalize } from './normalize'
import { crud } from './crud'
import { Tree } from './Tree'

const { schema, pattern, inputs } = outlinerSpec
const commands = inputs
  .filter((i): i is typeof i & { chord: string } => 'chord' in i && typeof i.chord === 'string')
  .map(({ chord, command, label }) => ({ chord, command, description: label }))

export function Outliner() {
  const [data, onEvent] = useZodCrudResource(resource, crud, normalize, { kind: pattern.aria, labelField: schema.labelField })
  return (
    <Tree
      data={data}
      onEvent={onEvent}
      options={{ ...pattern.options, commands }}
      className="font-mono text-sm p-6"
      itemClassName="py-0.5"
    />
  )
}
