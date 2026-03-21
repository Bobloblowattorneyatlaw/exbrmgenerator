import { searchItems } from 'esri/portal/support/search'
import { getStyle } from 'esri/symbols/support/styleUtils'
import Symbol from 'esri/symbols/Symbol'

export interface LoadedStyleGroup {
  styleName: string
  symbols: {
    symbolName: string
    symbol: Symbol
  }[]
}

export async function loadAllOrg2DStyles(portal): Promise<LoadedStyleGroup[]> {
  const query = 'type:"Style" AND (typekeywords:"2D" OR typekeywords:"SymbolSet")'
  const results = await searchItems({ query, portal })

  const groups: LoadedStyleGroup[] = []

  for (const item of results.results) {
    const style = await getStyle({ styleName: item.name, portal })
    const names = await style.getSymbolNames()

    const symbols = await Promise.all(
      names.map(async name => ({
        symbolName: name,
        symbol: await style.getSymbol(name)
      }))
    )

    groups.push({
      styleName: item.name,
      symbols
    })
  }

  return groups
}