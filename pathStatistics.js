const { map, get, mean, flow } = require('lodash/fp');

module.exports = pathStatistics = (source, expansion) => {
  const numberOfPath = get(`expansion.length`, expansion)

  const meanPathLen = flow([
    map((expansion) => get('path.length', expansion)),
    mean
  ])(get('expansion', expansion))

  return `
  ${source}:
  type: ${get('id_type', expansion)},
  value: ${get('id_value', expansion)},
  number of path: ${numberOfPath},
  mean path length: ${meanPathLen}
  ##################################
  `
}