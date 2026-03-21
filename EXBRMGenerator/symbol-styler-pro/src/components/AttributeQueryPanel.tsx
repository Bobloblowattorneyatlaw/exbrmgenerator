import { React } from 'jimu-core';
import { AttributeOperator } from '../types';

interface Props {
  mapView: __esri.MapView | undefined;
  allowedLayerIds: string[];
  onRunQuery: (layerId: string, field: string, operator: AttributeOperator, value: any) => void;
}

export default function AttributeQueryPanel(props: Props) {
  const { mapView, allowedLayerIds, onRunQuery } = props;

  const [layerId, setLayerId] = React.useState('');
  const [fields, setFields] = React.useState<string[]>([]);
  const [field, setField] = React.useState('');
  const [operator, setOperator] = React.useState<AttributeOperator>('equals');
  const [value, setValue] = React.useState('');

  // Load fields when layer changes
  React.useEffect(() => {
    if (!mapView || !layerId) {
      setFields([]);
      return;
    }

    const layer = mapView.map.findLayerById(layerId) as __esri.FeatureLayer;
    if (!layer) {
      setFields([]);
      return;
    }

    layer.load().then(() => {
      const fieldNames = layer.fields.map(f => f.name);
      setFields(fieldNames);
    });
  }, [layerId, mapView]);

  const runQuery = () => {
    if (!layerId || !field) return;
    onRunQuery(layerId, field, operator, value);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h4>Select by Attribute</h4>

      {/* Layer Selector */}
      <div style={{ marginTop: 8 }}>
        <label>Layer</label>
        <select
          value={layerId}
          onChange={e => setLayerId(e.target.value)}
          style={{ width: '100%', padding: 4, marginTop: 4 }}
        >
          <option value="">-- Select Layer --</option>
          {allowedLayerIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      {/* Field Selector */}
      <div style={{ marginTop: 8 }}>
        <label>Field</label>
        <select
          value={field}
          onChange={e => setField(e.target.value)}
          style={{ width: '100%', padding: 4, marginTop: 4 }}
          disabled={!fields.length}
        >
          <option value="">-- Select Field --</option>
          {fields.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Operator Selector */}
      <div style={{ marginTop: 8 }}>
        <label>Operator</label>
        <select
          value={operator}
          onChange={e => setOperator(e.target.value as AttributeOperator)}
          style={{ width: '100%', padding: 4, marginTop: 4 }}
        >
          <option value="equals">equals</option>
          <option value="contains">contains</option>
          <option value="greater">greater than</option>
          <option value="less">less than</option>
          <option value="in">in (comma-separated)</option>
        </select>
      </div>

      {/* Value Input */}
      <div style={{ marginTop: 8 }}>
        <label>Value</label>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{ width: '100%', padding: 4, marginTop: 4 }}
        />
      </div>

      {/* Run Button */}
      <button
        onClick={runQuery}
        style={{
          marginTop: 12,
          padding: '6px 12px',
          background: '#007ac2',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Run Query
      </button>
    </div>
  );
}