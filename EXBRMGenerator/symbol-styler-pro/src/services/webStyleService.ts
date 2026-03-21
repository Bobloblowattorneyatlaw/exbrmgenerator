import { WebStyleSymbolItem } from '../types';

/**
 * Loads a Web Style from ArcGIS Online and returns its symbol items.
 * This function:
 *  - Searches for the style by title
 *  - Loads its root.json
 *  - Extracts symbols, categories, thumbnails, and symbol JSON
 *
 * @param styleName The title of the Web Style item in ArcGIS Online
 * @returns Promise<WebStyleSymbolItem[]>
 */
export async function loadWebStyleSymbols(styleName: string): Promise<WebStyleSymbolItem[]> {
  const portalUrl = 'https://www.arcgis.com';

  // 1. Search for the Web Style item
  const searchUrl =
    `${portalUrl}/sharing/rest/search?f=json&num=10&sortField=title&sortOrder=asc` +
    `&q=typekeywords:"Style" AND title:"${encodeURIComponent(styleName)}"`;

  const searchResponse = await fetch(searchUrl).then(r => r.json());

  if (!searchResponse.results || searchResponse.results.length === 0) {
    console.warn(`Web Style "${styleName}" not found.`);
    return [];
  }

  const styleItem = searchResponse.results[0];

  // 2. Load the style's root.json
  const rootUrl =
    `${portalUrl}/sharing/rest/content/items/${styleItem.id}/resources/styles/root.json?f=json`;

  const rootJson = await fetch(rootUrl).then(r => r.json());

  if (!rootJson.items) {
    console.warn(`Web Style "${styleName}" has no items in root.json.`);
    return [];
  }

  // 3. Normalize items into WebStyleSymbolItem[]
  const items: WebStyleSymbolItem[] = rootJson.items.map((item: any) => ({
    name: item.name,
    category: item.category || null,
    tags: item.tags || [],
    type: item.type || null,
    thumbnail: item.thumbnail ? `${portalUrl}/sharing/rest/content/items/${styleItem.id}/resources/${item.thumbnail}` : null,
    symbol: item.symbol
  }));

  return items;
}