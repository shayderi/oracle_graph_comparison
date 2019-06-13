import { set, get } from 'lodash/fp';

function numberOfPath(oracleResult, graphResult) {

  comparisonResult = {};

  [{source: 'oracle', result: oracleResult}, 
   {source: 'graph', result: graphResult}].forEach((result) => {
     get('result.expansion', result).forEach((path, idx) => {
      path_idx = `${result.source}._${idx}`
      comparisonResult = set(path, {}, comparisonResult);
     })
   })
}