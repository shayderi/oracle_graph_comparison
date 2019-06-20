const  { get, drop } = require('lodash/fp');
const pathStatistics = require('./pathStatistics');
const {valuesVectorStats, identicalVectorsCmp, tuplesCmp} = require('./valuesSimilarity');
const {sample, expandOracleAndGraph} = require('./expansionProvider')

async function comparison(oracleResult, graphResult, statistics, comparisons) {
  const maxLen = Math.max(get('length', oracleResult), get('length', graphResult))
  for (var index = 0; index < maxLen; index++) {
    statistics.forEach(statistic => {
      console.log(statistic('oracle', oracleResult[index]))
      console.log(statistic('graph', graphResult[index]))
    });
    comparisons.forEach(comparison => {
      console.log(comparison(oracleResult[index], graphResult[index]))
    });
  }
}

const expand = get('argv[2]', process) == 'sample' ? sample : expandOracleAndGraph

expand(drop(2, process.argv)).then((resultsSample) => {
  comparison(
    resultsSample.oracle, 
    resultsSample.graph, 
    [pathStatistics, valuesVectorStats], // statistics list
    [identicalVectorsCmp, tuplesCmp] // comparisons list
  )
})