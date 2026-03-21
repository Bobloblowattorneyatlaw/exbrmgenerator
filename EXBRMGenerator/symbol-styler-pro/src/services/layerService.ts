/**
 * layerService.ts
 *
 * Provides utilities for filtering map layers based on the widget settings.
 * Only layers explicitly selected in the widget settings are eligible for:
 *  - Styling
 *  - Attribute queries
 *  - Selection monitoring
 */

/**
 * Filters the map's layers to only those allowed by the widget config.
 *
 * @param layers Collection of map layers (Layer[])
 * @param allowedLayerIds Array of layer IDs selected in widget settings
 * @returns FeatureLayer[]
 */
export function filterLayersByConfig(
  layers: __esri.Collection<__esri.Layer>,
  allowedLayerIds: string[]
): __esri.FeatureLayer[] {
  if (!layers || !allowedLayerIds || allowedLayerIds.length === 0) {
    return [];
  }

  const result: __esri.FeatureLayer[] = [];

  layers.forEach(layer => {
    if (
      allowedLayerIds.includes(layer.id) &&
      layer.type === 'feature'
    ) {
      result.push(layer as __esri.FeatureLayer);
    }
  });

  return result;
}

/**
 * Retrieves a single FeatureLayer by ID, but only if it is allowed.
 *
 * @param layers Collection of map layers
 * @param allowedLayerIds Array of allowed layer IDs
 * @param layerId The layer ID to retrieve
 * @returns FeatureLayer | null
 */
export function getAllowedLayerById(
  layers: __esri.Collection<__esri.Layer>,
  allowedLayerIds: string[],
  layerId: string
): __esri.FeatureLayer | null {
  if (!layers || !allowedLayerIds.includes(layerId)) {
    return null;
  }

  const layer = layers.find(l => l.id === layerId);
  if (layer && layer.type === 'feature') {
    return layer as __esri.FeatureLayer;
  }

  return null;
}