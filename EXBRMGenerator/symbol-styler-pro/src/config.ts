export interface Config {
  /**
   * The name of the ArcGIS Online Web Style to load.
   * Example: "Esri2DPointSymbolsStyle"
   */
  styleGroup: string;

  /**
   * Whether to persist symbol changes back to the feature service
   * using applyEdits().
   */
  persistToServer: boolean;

  /**
   * The attribute field used to store the symbol name
   * when persistToServer = true.
   */
  symbolAttribute: string;

  /**
   * List of layer IDs (from the map) that the widget is allowed to style.
   * These are selected in the widget settings panel.
   */
  allowedLayerIds: string[];
}