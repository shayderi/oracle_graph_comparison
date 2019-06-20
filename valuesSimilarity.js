const { getOr, flow, map, get, intersectionBy, differenceBy, zip, drop, initial, flatten, uniqBy } = require('lodash/fp');

const valuesVectorStats = (source, expansion) => {
  const valuesArr = map(exp => `${map(path => get('id_value', path), get('path', exp))}\n`, get('expansion', expansion))
  return `
  ${source}:
  ${valuesArr}
  ########################
  `
}

const identicalVectorsCmp = (oracleExpansion, graphExpansion) => {
  const identical = []

  get('expansion', graphExpansion).forEach(pathItem => {
    let graphSig = `${map(path => get('id_value', path), pathItem.path)}`
    get('expansion', oracleExpansion).forEach(pathItem => {
      let oracleSig = `${map(path => get('id_value', path), pathItem.path)}`
      if(oracleSig == graphSig){
        identical.push(`${oracleSig}\n`)
      }
    });  
  });
  return `
  Identical path:
  ${identical}
  `
}

const allAdjacentTuples = (arr) => {
  if(getOr(0, 'length', arr) < 1) return
  const res = []
  arr.forEach(innerArr => {
    const partialRes = initial(zip(innerArr, [...drop(1,innerArr), innerArr[0]]))
    res.push(partialRes)
  })
  
  return res
}

const tuplesCmp = (oracleExpansion, graphExpansion) => {
  const expansionToAllUniqueAdjacent = flow([
    map(pathItem => get('path', pathItem)),
    map(pathArr  => {
      return map(item => get('id_value', item), pathArr)
    }),
    allAdjacentTuples, // after this step we have [ [(1,2), (2,3), ...], ... ]
    flatten,
    uniqBy((tuplesArr) => tuplesArr.toString())
  ])

  const oracleUniqueTuples = expansionToAllUniqueAdjacent(get('expansion', oracleExpansion))
  const graphUniqueTuples = expansionToAllUniqueAdjacent(get('expansion', graphExpansion))

  const tuplesExistAtBoth = intersectionBy((arr) => arr.toString(), oracleUniqueTuples, graphUniqueTuples)
  const tuplesOnlyAtGraph = differenceBy((arr) => arr.toString(), graphUniqueTuples, oracleUniqueTuples)
  const tuplesOnlyAtOracle = differenceBy((arr) => arr.toString(), oracleUniqueTuples, graphUniqueTuples)

  return `
  Tuples:
  
  Exist at both: ${map(item => ` | ${item} |`,tuplesExistAtBoth)}
  Graph only: ${map(item => ` | ${item} |`,tuplesOnlyAtGraph)}
  Oracle only: ${map(item => ` | ${item} |`,tuplesOnlyAtOracle)}

  #############################`
}

module.exports = {
  valuesVectorStats,
  identicalVectorsCmp,
  tuplesCmp
}