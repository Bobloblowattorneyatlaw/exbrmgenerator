import { React, AllWidgetSettingProps } from 'jimu-core'
import { MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import { TextInput, Label } from 'jimu-ui'

export default function Setting(props: AllWidgetSettingProps<any>) {
  const onMapWidgetChange = (ids: string[]) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set('mapWidgetIds', ids)
    })
  }

  const onAttributeFieldChange = (value: string) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set('attributeField', value)
    })
  }

  return (
    <div className="widget-setting">
      <h4>Select a Map</h4>
      <MapWidgetSelector
        onSelect={onMapWidgetChange}
        useMapWidgetIds={props.config.mapWidgetIds}
      />

      <Label className="mt-3">Attribute Field (for rules)</Label>
      <TextInput
        value={props.config.attributeField}
        onChange={e => onAttributeFieldChange(e.target.value)}
        placeholder="TYPE"
      />
    </div>
  )
}