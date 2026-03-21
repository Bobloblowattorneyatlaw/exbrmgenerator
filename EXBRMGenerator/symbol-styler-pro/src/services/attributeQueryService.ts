/**
 * attributeQueryService.ts
 *
 * Provides basic Select‑By‑Attribute functionality.
 * Supports operators:
 *  - equals
 *  - contains
 *  - greater
 *  - less
 *  - in
 */

import { AttributeOperator } from '../types';

/**
 * Runs an attribute query on a specific layer.
 *
 * @param view MapView
 * @param layerId string
 * @param field string
 * @param operator AttributeOperator
 * @param value any
 * @returns Promise<Graphic[]>
 */
export async function queryFeaturesByAttribute(
  view: __esri.MapView,
  layerId: string,
  field: string,
  operator: AttributeOperator,
  value: any
): Promise<__esri.Graphic[]> {
  if (!view || !layerId || !field) return [];

  const layer = view.map.findLayerById(layerId) as __esri.FeatureLayer;
  if (!layer) {
    console.warn(`Layer ${layerId} not found.`);
    return [];
  }

  const query = layer.createQuery();
  query.returnGeometry = true;
  query.outFields = ['*'];

  // Build WHERE clause
  query.where = buildWhereClause(field, operator, value);

  try {
    const result = await layer.queryFeatures(query);
    return result.features || [];
  } catch (err) {
    console.error('Attribute query failed:', err);
    return [];
  }
}

/**
 * Builds a SQL WHERE clause for the supported operators.
 */
function buildWhereClause(
  field: string,
  operator: AttributeOperator,
  value: any
): string {
  switch (operator) {
    case 'equals':
      return `${field} = '${escapeValue(value)}'`;

    case 'contains':
      return `${field} LIKE '%${escapeValue(value)}%'`;

    case 'greater':
      return `${field} > ${numeric(value)}`;

    case 'less':
      return `${field} < ${numeric(value)}`;

    case 'in':
      if (Array.isArray(value)) {
        const list = value.map(v => `'${escapeValue(v)}'`).join(',');
        return `${field} IN (${list})`;
      }
      return `${field} IN ('${escapeValue(value)}')`;

    default:
      return '1=1';
  }
}

/**
 * Escapes single quotes for SQL safety.
 */
function escapeValue(v: any): string {
  return String(v).replace(/'/g, "''");
}

/**
 * Converts a value to a number for numeric comparisons.
 */
function numeric(v: any): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}