import { React, AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
import UniqueValueRenderer from 'esri/renderers/UniqueValueRenderer'
import SymbolPicker from './SymbolPicker'
import { loadAllOrg2DStyles, LoadedStyleGroup } from './StyleLoader'

export default function Widget(props: AllWidgetProps<any>) {
  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null)
  const [selectedFeature, setSelectedFeature] = React.useState<any>(null)
  const [styles, setStyles] = React.useState<LoadedStyleGroup[]>([])
  const [currentSymbol, setCurrentSymbol] = React.useState<any>(null)
  const [size, setSize] = React.useState(24)

  const attributeField = props.config.attributeField

  const handleActiveView = async (jmv: JimuMapView) => {
    if (!jmv) return
    setJimuMapView(jmv)

    const portal = jmv.view.portalItem?.portal
    const loaded = await loadAllOrg2DStyles(portal)
    setStyles(loaded)

    jmv.view.on('click', async (event) => {
      const hit = await jmv.view.hitTest(event)
      const result = hit.results.find(r => r.graphic?.layer?.type === 'feature')
      if (!result) return

      setSelectedFeature(result.graphic)
    })
  }

  const applySymbol = (symbol) => {
    if (!selectedFeature) return

    const layer = selectedFeature.layer
    const objectIdField = layer.objectIdField

    if (symbol.size !== undefined) {
      symbol.size = size
    }

    const value = attributeField
      ? selectedFeature.attributes[attributeField]
      : selectedFeature.attributes[objectIdField]

    const renderer = new UniqueValueRenderer({
      field: attributeField || objectIdField,
      defaultSymbol: layer.renderer.symbol,
      uniqueValueInfos: [
        {
          value,
          symbol
        }
      ]
    })

    layer.renderer = renderer
    setCurrentSymbol(symbol)
  }

  return (
    <div className="change-symbol-widget p-3">
      {props.config.mapWidgetIds?.length > 0 && (
        <JimuMapViewComponent
          useMapWidgetId={props.config.mapWidgetIds[0]}
          onActiveViewChange={handleActiveView}
        />
      )}

      <div className="mb-2">
        {selectedFeature
          ? `Selected feature: ${selectedFeature.attributes[attributeField] || selectedFeature.attributes[selectedFeature.layer.objectIdField]}`
          : 'Click a feature to select it'}
      </div>

      <SymbolPicker
        styles={styles}
        onSelect={applySymbol}
        currentSymbol={currentSymbol}
        size={size}
        onSizeChange={setSize}
      />
    </div>
  )
}