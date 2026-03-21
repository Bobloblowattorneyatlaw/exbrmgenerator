import { React } from 'jimu-core';
import SymbolPreview from './SymbolPreview';

interface Props {
  features: __esri.Graphic[];
}

export default function FeatureList(props: Props) {
  const { features } = props;

  if (!features || features.length === 0) {
    return (
      <div style={{ marginTop: 12, color: '#888' }}>
        No features selected.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Selected Features</h4>

      <div
        style={{
          maxHeight: 150,
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: 4,
          padding: 8,
          background: '#fafafa'
        }}
      >
        {features.map((f, idx) => {
          const oidField = f.layer?.objectIdField;
          const oid = oidField ? f.attributes[oidField] : idx + 1;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 0',
                borderBottom: '1px solid #eee'
              }}
            >
              <SymbolPreview symbol={f.symbol} size={28} />

              <div style={{ marginLeft: 10 }}>
                <div style={{ fontWeight: 600 }}>
                  Feature {oid}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {f.layer?.title || f.layer?.id}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}