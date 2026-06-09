function svgPlaceholder(size: number, text = 'Product', bg = '#f5f2ff', color = '#747688') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect fill="${bg}" width="${size}" height="${size}"/>
    <text fill="${color}" font-family="sans-serif" font-size="${Math.max(12, size * 0.05)}" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const PLACEHOLDER_48 = svgPlaceholder(48)
export const PLACEHOLDER_80 = svgPlaceholder(80)
export const PLACEHOLDER_96 = svgPlaceholder(96)
export const PLACEHOLDER_150 = svgPlaceholder(150)
export const PLACEHOLDER_400 = svgPlaceholder(400)
export const PLACEHOLDER_600 = svgPlaceholder(600)
