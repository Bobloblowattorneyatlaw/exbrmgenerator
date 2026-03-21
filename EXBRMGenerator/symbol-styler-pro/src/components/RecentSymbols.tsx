import { React } from 'jimu-core';
import { RecentSymbol } from '../types';
import SymbolPreview from './SymbolPreview';

interface Props {
  symbols: RecentSymbol[];
  onSelect: (symbol: any) => void;
}

export default function RecentSymbols(props: Props) {
  const { symbols, onSelect } = props;

  if (!symbols || symbols.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Recently Used</h4>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 8,
          marginTop: 8,
          overflowX: 'auto',
          paddingBottom: 4
        }}
      >
        {symbols.map((item, idx) => (
          <SymbolPreview
            key={idx}
            symbol={item.symbol}
            size={36}
            title={item.name}
            onClick={() => onSelect(item.symbol)}
          />
        ))}
      </div>
    </div>
  );
}