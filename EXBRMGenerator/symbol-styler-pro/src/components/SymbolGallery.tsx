import { React } from 'jimu-core';
import { WebStyleSymbolItem } from '../types';
import { renderSymbolPreview } from '../services/previewService';

interface Props {
  symbols: WebStyleSymbolItem[];
  activeCategory: string | null;
  onSelect: (symbol: any) => void;
}

export default function SymbolGallery(props: Props) {
  const { symbols, activeCategory, onSelect } = props;

  const [previews, setPreviews] = React.useState<Record<string, string>>({});

  // Generate previews when symbols change
  React.useEffect(() => {
    if (!symbols || symbols.length === 0) return;

    const loadPreviews = async () => {
      const map: Record<string, string> = {};

      for (const item of symbols) {
        try {
          const preview = await renderSymbolPreview(item.symbol, 40);
          map[item.name] = preview;
        } catch {
          map[item.name] = '';
        }
      }

      setPreviews(map);
    };

    loadPreviews();
  }, [symbols]);

  // Filter by category
  const filtered = activeCategory
    ? symbols.filter(s => s.category === activeCategory)
    : symbols;

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Symbols</h4>

      {filtered.length === 0 && (
        <div style={{ color: '#888', marginTop: 8 }}>
          No symbols found for this category.
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 48px)',
          gap: 8,
          marginTop: 8
        }}
      >
        {filtered.map(item => (
          <div
            key={item.name}
            onClick={() => onSelect(item.symbol)}
            style={{
              width: 48,
              height: 48,
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff'
            }}
            title={item.name}
          >
            {previews[item.name] ? (
              <img
                src={previews[item.name]}
                alt={item.name}
                style={{ width: 32, height: 32 }}
              />
            ) : (
              <div style={{ fontSize: 10, color: '#aaa' }}>Loading…</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}