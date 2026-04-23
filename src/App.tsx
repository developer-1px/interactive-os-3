import { useReducer, useRef, useState } from 'react'
import {
  Carousel, ColumnHeader, Combobox, Dialog, Disclosure, Grid, GridCell,
  Listbox, ListboxGroup, Menu, Menubar, MenuGroup, MenuItem, MenuItemCheckbox,
  MenuItemRadio, MenuList, Meter, Option, Progress, Radio, RadioGroup, Row,
  RowGroup, RowHeader, Separator, Slide, Switch, Tab, TabList, TabPanel,
  Toolbar, ToolbarButton, Tooltip, Tree, TreeGrid, TreeRow,
  FOCUS, ROOT, reduce, type Event, type NormalizedData,
} from './controls'

const initial: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT, data: { label: 'File' } },
    [FOCUS]: { id: FOCUS },
    new: { id: 'new', data: { label: 'New' } },
    open: { id: 'open', data: { label: 'Open…' } },
    save: { id: 'save', data: { label: 'Save', disabled: true } },
    export: { id: 'export', data: { label: 'Export' } },
    pdf: { id: 'pdf', data: { label: 'PDF' } },
    png: { id: 'png', data: { label: 'PNG' } },
    svg: { id: 'svg', data: { label: 'SVG' } },
    close: { id: 'close', data: { label: 'Close' } },
  },
  relationships: {
    [ROOT]: ['new', 'open', 'save', 'export', 'close'],
    export: ['pdf', 'png', 'svg'],
  },
}

function reducer(d: NormalizedData, e: Event): NormalizedData {
  if (e.type === 'activate') console.log('activate', e.id)
  return reduce(d, e)
}

const mk = (id: string, label = id, extra: Record<string, unknown> = {}) => ({ id, data: { label, ...extra } })
const treeInitial: NormalizedData = {
  entities: Object.fromEntries([
    [ROOT, { id: ROOT }],
    [FOCUS, { id: FOCUS, data: { id: 'src' } }],
    ...[
      mk('src'),
      mk('components'),
      mk('Button.tsx'),
      mk('Input.tsx'),
      mk('menu', 'menu'),
      mk('MenuItem.tsx'),
      mk('MenuGroup.tsx'),
      mk('MenuPopover.tsx'),
      mk('utils'),
      mk('format.ts'),
      mk('parse.ts'),
      mk('deprecated.ts', 'deprecated.ts', { disabled: true }),
      mk('App.tsx'),
      mk('main.tsx'),
      mk('public'),
      mk('images'),
      mk('logo.svg'),
      mk('banner.png'),
      mk('icons'),
      mk('home.svg'),
      mk('user.svg'),
      mk('favicon.ico'),
      mk('package.json'),
      mk('README.md'),
    ].map((e) => [e.id, e]),
  ]),
  relationships: {
    [ROOT]: ['src', 'public', 'package.json', 'README.md'],
    src: ['components', 'utils', 'App.tsx', 'main.tsx'],
    components: ['Button.tsx', 'Input.tsx', 'menu'],
    menu: ['MenuItem.tsx', 'MenuGroup.tsx', 'MenuPopover.tsx'],
    utils: ['format.ts', 'parse.ts', 'deprecated.ts'],
    public: ['images', 'favicon.ico'],
    images: ['logo.svg', 'banner.png', 'icons'],
    icons: ['home.svg', 'user.svg'],
  },
}

export default function App() {
  const [data, dispatch] = useReducer(reducer, initial)
  const [treeData, treeDispatch] = useReducer(reducer, treeInitial)
  const [sw1, setSw1] = useState(true)
  const [sw2, setSw2] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const alertRef = useRef<HTMLDialogElement>(null)

  return (
    <main style={{ padding: 24 }}>
      <h1>ds — Roving controls</h1>

      <section style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h3>Input controls (same height as roving)</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button>Button</button>
            <button aria-pressed="true">Pressed</button>
            <button disabled>Disabled</button>
            <input placeholder="text" />
            <input type="search" placeholder="search" />
            <input type="number" defaultValue={42} style={{ width: 80 }} />
            <select defaultValue="a">
              <option value="a">Option A</option>
              <option value="b">Option B</option>
            </select>
            <input disabled placeholder="disabled" />
            <Listbox aria-label="Inline">
              <Option selected>Roving</Option>
              <Option>Item</Option>
            </Listbox>
          </div>
          <div style={{ marginTop: 8 }}>
            <textarea placeholder="textarea — line-height matches" rows={2} style={{ width: 320 }} />
          </div>
        </div>
      </section>

      <section style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <h3>Menu</h3>
          <Menu data={data} onEvent={dispatch} />
        </div>

        <div>
          <h3>Menubar</h3>
          <Menubar aria-label="Main">
            <MenuItem selected>File</MenuItem>
            <MenuItem>Edit</MenuItem>
            <MenuItem>View</MenuItem>
            <MenuItem disabled>Help</MenuItem>
          </Menubar>
        </div>

        <div>
          <h3>Listbox (option, grouped)</h3>
          <Listbox aria-label="Foods">
            <ListboxGroup label="Fruits">
              <Option selected>Apple</Option>
              <Option>Banana</Option>
              <Option disabled>Cherry</Option>
            </ListboxGroup>
            <ListboxGroup label="Vegetables">
              <Option>Carrot</Option>
              <Option>Potato</Option>
            </ListboxGroup>
          </Listbox>
        </div>

        <div>
          <h3>Tabs</h3>
          <TabList aria-label="Views">
            <Tab selected controls="panel-1">Overview</Tab>
            <Tab controls="panel-2">Details</Tab>
            <Tab disabled>Admin</Tab>
          </TabList>
          <TabPanel id="panel-1">
            Overview content
          </TabPanel>
        </div>

        <div>
          <h3>Tree</h3>
          <Tree aria-label="Files" data={treeData} onEvent={treeDispatch} />
        </div>

        <div>
          <h3>Grid (with headers)</h3>
          <Grid aria-label="Data" style={{ borderCollapse: 'separate', borderSpacing: 2 }}>
            <RowGroup>
              <Row>
                <ColumnHeader>A</ColumnHeader>
                <ColumnHeader>B</ColumnHeader>
                <ColumnHeader>C</ColumnHeader>
              </Row>
            </RowGroup>
            <RowGroup>
              <Row>
                <RowHeader>1</RowHeader>
                <GridCell selected>A1</GridCell>
                <GridCell>B1</GridCell>
                <GridCell disabled>C1</GridCell>
              </Row>
              <Row>
                <RowHeader>2</RowHeader>
                <GridCell>A2</GridCell>
                <GridCell>B2</GridCell>
                <GridCell>C2</GridCell>
              </Row>
            </RowGroup>
          </Grid>
        </div>

        <div>
          <h3>Toolbar</h3>
          <Toolbar aria-label="Format">
            <ToolbarButton pressed>B</ToolbarButton>
            <ToolbarButton>I</ToolbarButton>
            <ToolbarButton>U</ToolbarButton>
            <Separator orientation="vertical" style={{ width: 1, height: 20, background: 'var(--ds-border)' }} />
            <ToolbarButton disabled>S</ToolbarButton>
          </Toolbar>
        </div>

        <div>
          <h3>Menu checkbox/radio (grouped)</h3>
          <MenuList aria-label="View options">
            <MenuItemCheckbox checked>Sidebar</MenuItemCheckbox>
            <MenuItemCheckbox checked={false}>Grid</MenuItemCheckbox>
            <Separator as="li" />
            <MenuGroup label="Theme">
              <MenuItemRadio checked>Light</MenuItemRadio>
              <MenuItemRadio checked={false}>Dark</MenuItemRadio>
              <MenuItemRadio checked={false} disabled>System</MenuItemRadio>
            </MenuGroup>
          </MenuList>
        </div>

        <div>
          <h3>Radio group</h3>
          <RadioGroup aria-label="Size">
            <Radio checked>Small</Radio>
            <Radio checked={false}>Medium</Radio>
            <Radio checked={false}>Large</Radio>
            <Radio checked={false} disabled>Huge</Radio>
          </RadioGroup>
        </div>

        <div>
          <h3>Combobox</h3>
          <Combobox
            aria-label="Fruit"
            expanded={false}
            controls="combo-list"
            placeholder="Type a fruit…"
          />
          <Listbox id="combo-list" aria-label="Suggestions" style={{ marginTop: 4 }}>
            <Option>Apple</Option>
            <Option>Apricot</Option>
            <Option>Avocado</Option>
          </Listbox>
        </div>

        <div>
          <h3>TreeGrid</h3>
          <TreeGrid aria-label="Files with size" style={{ borderCollapse: 'separate', borderSpacing: 2 }}>
            <RowGroup>
              <Row>
                <ColumnHeader>Name</ColumnHeader>
                <ColumnHeader>Size</ColumnHeader>
              </Row>
            </RowGroup>
            <RowGroup>
              <TreeRow level={1} posinset={1} setsize={2} expanded>
                <RowHeader>src</RowHeader>
                <GridCell>—</GridCell>
              </TreeRow>
              <TreeRow level={2} posinset={1} setsize={2}>
                <RowHeader>App.tsx</RowHeader>
                <GridCell>4 KB</GridCell>
              </TreeRow>
              <TreeRow level={1} posinset={2} setsize={2}>
                <RowHeader>package.json</RowHeader>
                <GridCell>1 KB</GridCell>
              </TreeRow>
            </RowGroup>
          </TreeGrid>
        </div>

        <div>
          <h3>Switch</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Switch checked={sw1} onClick={() => setSw1((v) => !v)} />
            <Switch checked={sw2} onClick={() => setSw2((v) => !v)} />
            <Switch checked disabled />
          </div>
        </div>

        <div>
          <h3>Dialog</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => dialogRef.current?.showModal()}>Open dialog</button>
            <button onClick={() => alertRef.current?.showModal()}>Open alert</button>
          </div>
          <Dialog ref={dialogRef}>
            <h3>Dialog title</h3>
            <p>Modal content goes here.</p>
            <form method="dialog" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button value="cancel">Cancel</button>
              <button value="ok" aria-pressed="true">OK</button>
            </form>
          </Dialog>
          <Dialog ref={alertRef} alert aria-labelledby="alert-title">
            <h3 id="alert-title">Delete file?</h3>
            <p>This action cannot be undone.</p>
            <form method="dialog" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button value="cancel">Cancel</button>
              <button value="confirm" aria-pressed="true">Delete</button>
            </form>
          </Dialog>
        </div>

        <div>
          <h3>Tooltip</h3>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button aria-describedby="tt1">Hover target</button>
            <Tooltip id="tt1" style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4 }}>
              Helpful hint
            </Tooltip>
          </div>
        </div>

        <div>
          <h3>Disclosure / Accordion</h3>
          <div style={{ width: 260 }}>
            <Disclosure summary="Section one" open>
              <p>First section content.</p>
            </Disclosure>
            <Disclosure summary="Section two">
              <p>Second section content.</p>
            </Disclosure>
            <Disclosure summary="Disabled" aria-disabled>
              <p>Third.</p>
            </Disclosure>
          </div>
        </div>

        <div>
          <h3>Progress / Meter</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}>
            <Progress value={30} max={100} />
            <Progress value={70} max={100} />
            <Progress />
            <Meter value={0.2} min={0} max={1} low={0.3} high={0.7} optimum={1} />
            <Meter value={0.55} min={0} max={1} low={0.3} high={0.7} optimum={1} />
            <Meter value={0.9} min={0} max={1} low={0.3} high={0.7} optimum={1} />
          </div>
        </div>

        <div>
          <h3>Carousel</h3>
          <Carousel label="Featured">
            <Slide label="One" posinset={1} setsize={3}>Slide 1</Slide>
            <Slide label="Two" posinset={2} setsize={3}>Slide 2</Slide>
            <Slide label="Three" posinset={3} setsize={3}>Slide 3</Slide>
          </Carousel>
        </div>
      </section>
    </main>
  )
}
