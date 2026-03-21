/**
 * Applies a symbol to a list of features on the client side.
 * This updates the feature's symbol and refreshes the layer view.
 *
 * @param features Array of Graphics
 * @param symbol ArcGIS symbol JSON
 */
export function applySymbolToFeatures(features: __esri.Graphic[], symbol: any): void {
  if (!features || features.length === 0) return;

  features.forEach(f => {
    f.symbol = symbol;

    // Refresh the layer to reflect symbol override
    if (f.layer && typeof f.layer.refresh === 'function') {
      f.layer.refresh();
    }
  });
}

/**
 * Persists symbol changes to the feature service using applyEdits().
 * Only updates the attribute field specified by the widget config.
 *
 * @param features Array of Graphics
 * @param attributes Key-value pairs to update (e.g., { symbolName: "FireStation" })
 */
export async function updateFeatureAttributes(
  features: __esri.Graphic[],
  attributes: Record<string, any>
): Promise<any> {
  if (!features || features.length === 0) return;

  const layer = features[0].layer as __esri.FeatureLayer;

  if (!layer || typeof layer.applyEdits !== 'function') {
    console.warn('Layer does not support applyEdits().');
    return;
  }

  const edits = features.map(f => ({
    objectId: f.attributes[layer.objectIdField],
    attributes
  }));

  try {
    const result = await layer.applyEdits({ updateFeatures: edits });
    return result;
  } catch (err) {
    console.error('Failed to apply edits:', err);
    throw err;
  }
}