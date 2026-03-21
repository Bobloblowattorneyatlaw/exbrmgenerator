/**
 * Represents a single symbol item from an ArcGIS Online Web Style.
 * These objects come from the style's root.json resource.
 */
export interface WebStyleSymbolItem {
  name: string;
  category?: string;
  tags?: string[];
  type?: string;
  thumbnail?: string;
  symbol: any; // ArcGIS JS API symbol JSON
}

/**
 * Represents a recently used symbol entry.
 */
export interface RecentSymbol {
  name: string;
  symbol: any;
  thumbnail?: string;
}

/**
 * Represents a single undo/redo state entry.
 */
export interface UndoStateEntry {
  feature: __esri.Graphic;
  oldSymbol: any;
  newSymbol: any;
}

/**
 * Represents a full undo/redo state (batch of features).
 */
export interface UndoState {
  features: __esri.Graphic[];
  oldSymbol: any;
  newSymbol: any;
}

/**
 * Basic attribute query operators supported by the widget.
 */
export type AttributeOperator =
  | 'equals'
  | 'contains'
  | 'greater'
  | 'less'
  | 'in';

/**
 * Attribute query request structure.
 */
export interface AttributeQueryRequest {
  layerId: string;
  field: string;
  operator: AttributeOperator;
  value: any;
}