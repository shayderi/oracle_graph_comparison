const request = require('request')
const sampleResults = require('./sample1')
const config = require('./config')

const sample = () => new Promise((resolve) => {
  resolve(sampleResults)
})

async function fetchExpand(typeValueArr) {

  const graphHeaders = {}
  const oracleHeaders = {}

  const graphOptions = {
    url: config.graphUrl,
    method: 'post',
    json: true,
    body: { // TODO
      "statements" : [ {
        "statement" : `call raf.IExpand()` // use typeValueArr here
      } ]
    },
    graphHeaders
  };

  const oracleOptions = {
    url: config.oracleUrl,
    method: 'post',
    json: true,
    body: {
      // TODO
    },
    oracleHeaders
  };

  const promiseArr = [
    request(graphOptions),
    request(oracleOptions)
  ]
  const results = await Promise.all(promiseArr);
  return results
}

module.exports = {
  sample,
  fetchExpand
}
