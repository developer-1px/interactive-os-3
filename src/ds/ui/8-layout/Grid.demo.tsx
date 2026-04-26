import { Grid } from './Grid'

export default function GridDemo() {
  return (
    <Grid cols={3}>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} style={{ padding: 8, border: '1px solid currentColor', borderRadius: 4, opacity: 0.6, textAlign: 'center' }}>
          {i + 1}
        </span>
      ))}
    </Grid>
  )
}
