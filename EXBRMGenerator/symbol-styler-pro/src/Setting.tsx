import { React, ImmutableObject } from 'jimu-core';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { TextInput, Switch, Label, Select, Option } from 'jimu-ui';
import { IMConfig } from './config';

export default function Setting(props: AllWidgetSettingProps<IMConfig>) {
  const { config, onSettingChange, useMapWidgetIds, onSettingChange: updateSetting } = props;

  const mapWidgetId = useMapWidgetIds?.[0];

  const handleConfigChange = (key: keyof IMConfig, value: any) => {
    onSettingChange({
      id: props.id,
      config: config.set(key, value)
    });
  };

  const handleLayerToggle = (layerId: string) => {
    const current = config.allowedLayerIds || [];
    const exists = current.includes(layerId);

    const updated = exists
      ? current.filter(id => id !== layerId)
      : [...current, layerId];

    handleConfigChange('allowedLayerIds', updated);
  };

  return (
    <div className="symbol-styler-settings" style={{ padding: 12 }}>
      {/* Web Style Settings */}
      <SettingSection title="Web Style Settings">
        <SettingRow label="Web Style Name">
          <TextInput
            value={config.styleGroup}
            onChange={evt => handleConfigChange('styleGroup', evt.target.value)}
            placeholder="e.g., Esri2DPointSymbolsStyle"
          />
        </SettingRow>
      </SettingSection>

      {/* Server Persistence */}
      <SettingSection title="Server Persistence">
        <SettingRow label="Persist to Feature Service">
          <Switch
            checked={config.persistToServer}
            onChange={evt => handleConfigChange('persistToServer', evt.target.checked)}
          />
        </SettingRow>

        <SettingRow label="Symbol Attribute Field">
          <TextInput
            value={config.symbolAttribute}
            onChange={evt => handleConfigChange('symbolAttribute', evt.target.value)}
            placeholder="e.g., symbolName"
          />
        </SettingRow>
      </SettingSection>

      {/* Layer Filtering */}
      <SettingSection title="Layer Access Control">
        <SettingRow>
          <Label>Select which layers can be styled:</Label>
        </SettingRow>

        {!mapWidgetId && (
          <SettingRow>
            <div style={{ color: '#888' }}>
              Add