import { React } from 'jimu-core';
import { renderSymbolPreview } from '../services/previewService';

interface Props {
  symbol: any;
  size?: number;
  title?: string;
  onClick?: () => void;
}

export default function SymbolPreview(props: Props) {
  const { symbol, size = 40, title, onClick } = props;

  const [preview, setPreview] = React.useState<string>('');

  React.useEffect(() => {
    if (!symbol) return;

    const load = async () => {
      try {
        const img = await renderSymbolPreview(symbol, size);
        setPreview(img);
      } catch {
        setPreview('');
      }
    };

    load();
  }, [symbol, size]);

  return (
    <div
      onClick={onClick}
      title={title}
      style={{
        width: size + 8,
        height: size + 8,
        border: '1px solid #ccc',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        background: '#fff'
      }}
    >
      {preview ? (
        <img
          src={preview}
          alt={title || ''}
          style={{ width: size - 8, height: size - 8 }}
        />
      ) : (
        <div style={{ fontSize: 10, color: '#aaa' }}>…</div>
      )}
    </div>
  );
}