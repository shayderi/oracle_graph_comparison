const { map, get } = require('lodash/fp');

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
  following path are identical in both results:
  ${identical}
  `
}

module.exports = {
  valuesVectorStats,
  identicalVectorsCmp
}