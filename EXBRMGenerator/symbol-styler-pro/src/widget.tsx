import { React, AllWidgetProps } from 'jimu-core';
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';
import { IMConfig } from './config';

import { loadWebStyleSymbols } from './services/webStyleService';
import { applySymbolToFeatures, updateFeatureAttributes } from './services/featureService';
import { UndoService } from './services/undoService';
import { filterLayersByConfig } from './services/layerService';
import { queryFeaturesByAttribute } from './services/attributeQueryService';

import SymbolGallery from './components/SymbolGallery';
import CategoryFilter from './components/CategoryFilter';
import RecentSymbols from './components/RecentSymbols';
import FeatureList from './components/FeatureList';
import AttributeQueryPanel from './components/AttributeQueryPanel';

export default function Widget(props: AllWidgetProps<IMConfig>) {
  const { config } = props;

  const [jmv, setJmv] = React.useState<JimuMapView>();
  const [selectedFeatures, setSelectedFeatures] = React.useState([]);
  const [symbols, setSymbols] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [recentSymbols, setRecentSymbols] = React.useState([]);

  const undo = React.useRef(new UndoService()).current;

  // ---------------------------
  // 1. Connect to Map
  // ---------------------------
  const onActiveViewChange = (view: JimuMapView) => {
    if (!view) return;
    setJmv(view);

    view.view.when(() => {
      const allowedLayers = filterLayersByConfig(view.view.map.layers, config.allowedLayerIds);

      allowedLayers.forEach(layer => {
        layer.when(() => {
          view.view.whenLayerView(layer).then(layerView => {
            layerView.watch("highlightIds", (ids) => {
              if (!ids || ids.size === 0) {
                setSelectedFeatures([]);
                return;
              }

              const features = [];
              ids.forEach(async (id) => {
                const query = layer.createQuery();
                query.objectIds = [id];
                const result = await layer.queryFeatures(query);
                if (result.features.length > 0) {
                  features.push(result.features[0]);
                }
                setSelectedFeatures([...features]);
              });
            });
          });
        });
      });
    });
  };

  // ---------------------------
  // 2. Load Web Style Symbols
  // ---------------------------
  React.useEffect(() => {
    if (!config.styleGroup) return;

    loadWebStyleSymbols(config.styleGroup)
      .then(styleItems => {
        setSymbols(styleItems);

        // Extract categories from Web Style JSON
        const cats = Array.from(
          new Set(styleItems.map(item => item.category).filter(Boolean))
        );
        setCategories(cats);
      });
  }, [config.styleGroup]);

  // ---------------------------
  // 3. Apply Symbol
  // ---------------------------
  const applySymbol = async (symbol) => {
    if (!selectedFeatures.length) return;

    // Save to recent symbols
    setRecentSymbols(prev => {
      const updated = [symbol, ...prev.filter(s => s.name !== symbol.name)];
      return updated.slice(0, 10);
    });

    // Save undo state
    undo.pushState(selectedFeatures, symbol);

    // Client-side override
    applySymbolToFeatures(selectedFeatures, symbol);

    // Server persistence
    if (config.persistToServer) {
      await updateFeatureAttributes(selectedFeatures, {
        [config.symbolAttribute]: symbol.name
      });
    }
  };

  // ---------------------------
  // 4. Undo / Redo
  // ---------------------------
  const undoLast = () => {
    const state = undo.undo();
    if (!state) return;
    applySymbolToFeatures(state.features, state.oldSymbol);
  };

  const redoLast = () => {
    const state = undo.redo();
    if (!state) return;
    applySymbolToFeatures(state.features, state.newSymbol);
  };

  // ---------------------------
  // 5. Select by Attribute
  // ---------------------------
  const runAttributeQuery = async (layerId, field, operator, value) => {
    if (!jmv) return;

    const results = await queryFeaturesByAttribute(jmv.view, layerId, field, operator, value);
    setSelectedFeatures(results);
  };

  // ---------------------------
  // Render UI
  // ---------------------------
  return (
    <div style={{ padding: 12 }}>
      <h3>Symbol Styler Pro</h3>

      {/* Feature List */}
      <FeatureList features={selectedFeatures} />

      {/* Undo / Redo */}
      <div style={{ marginTop: 10 }}>
        <button onClick={undoLast} disabled={!undo.canUndo()}>Undo</button>
        <button onClick={redoLast} disabled={!undo.canRedo()}>Redo</button>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Recently Used */}
      <RecentSymbols
        symbols={recentSymbols}
        onSelect={applySymbol}
      />

      {/* Symbol Gallery */}
      <SymbolGallery
        symbols={symbols}
        activeCategory={activeCategory}
        onSelect={applySymbol}
      />

      {/* Select by Attribute */}
      <AttributeQueryPanel
        mapView={jmv?.view}
        allowedLayerIds={config.allowedLayerIds}
        onRunQuery={runAttributeQuery}
      />

      {/* Map Connection */}
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={onActiveViewChange}
      />
    </div>
  );
}