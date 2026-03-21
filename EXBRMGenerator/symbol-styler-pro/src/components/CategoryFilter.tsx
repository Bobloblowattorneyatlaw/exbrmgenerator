import { React } from 'jimu-core';

interface Props {
  categories: string[];
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryFilter(props: Props) {
  const { categories, activeCategory, onSelect } = props;

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Categories</h4>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 8
        }}
      >
        {/* "All" button */}
        <div
          onClick={() => onSelect(null)}
          style={{
            padding: '4px 10px',
            borderRadius: 4,
            cursor: 'pointer',
            background: activeCategory === null ? '#007ac2' : '#eee',
            color: activeCategory === null ? '#fff' : '#333',
            border: '1px solid #ccc'
          }}
        >
          All
        </div>

        {/* Category buttons */}
        {categories.map(cat => (
          <div
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              padding: '4px 10px',
              borderRadius: 4,
              cursor: 'pointer',
              background: activeCategory === cat ? '#007ac2' : '#eee',
              color: activeCategory === cat ? '#fff' : '#333',
              border: '1px solid #ccc'
            }}
          >
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}