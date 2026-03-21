import { React } from 'jimu-core'
import { TextInput, Label, Slider } from 'jimu-ui'
import { LoadedStyleGroup } from './StyleLoader'

export default function SymbolPicker({
  styles,
  onSelect,
  currentSymbol,
  size,
  onSizeChange
}) {
  const [filter, setFilter] = React.useState('')
  const [openGroups, setOpenGroups] = React.useState<{ [key: string]: boolean }>({})

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const getSymbolUrl = (symbol: any) =>
    symbol.url || symbol.imageData || null

  return (
    <div>
      <Label>Filter symbols</Label>
      <TextInput
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search symbols or styles..."
        className="mb-2"
      />

      {currentSymbol && (
        <div className="mb-3">
          <Label>Current symbol</Label>
          <img src={getSymbolUrl(currentSymbol)} width={32} height={32} />
        </div>
      )}

      <Label>Symbol size</Label>
      <Slider
        min={8}
        max={64}
        step={1}
        value={size}
        onChange={(_, v) => onSizeChange(v)}
        className="mb-3"
      />

      {styles.map((group, i) => {
        const filtered = group.symbols.filter(s =>
          s.symbolName.toLowerCase().includes(filter.toLowerCase()) ||
          group.styleName.toLowerCase().includes(filter.toLowerCase())
        )

        if (!filtered.length) return null

        return (
          <div key={i} style={{ marginBottom: 10 }}>
            <div
              style={{
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: 4
              }}
              onClick={() => toggleGroup(group.styleName)}
            >
              {openGroups[group.styleName] ? '▾' : '▸'} {group.styleName}
            </div>

            {openGroups[group.styleName] && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {filtered.map((s, j) => (
                  <div
                    key={j}
                    style={{
                      border: '1px solid #ccc',
                      padding: 6,
                      cursor: 'pointer',
                      width: 90,
                      textAlign: 'center'
                    }}
                    onClick={() => onSelect(s.symbol)}
                  >
                    {getSymbolUrl(s.symbol) && (
                      <img
                        src={getSymbolUrl(s.symbol)}
                        width={size}
                        height={size}
                      />
                    )}
                    <div style={{ fontSize: 11 }}>{s.symbolName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}