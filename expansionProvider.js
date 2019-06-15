const request = require('request')
const sampleResults = require('./sample1')
const config = require('./config')

const sample = () => sampleResults

async function fetchExpand(typeValueArr) {
  const requestBody = {

  }

  const graphHeaders = {}
  const oracleHeaders = {}

  const graphOptions = {
    url: config.graphUrl,
    method: 'post',
    json: true,
    body: requestBody,
    graphHeaders
  };

  const oracleOptions = {
    url: config.oracleUrl,
    method: 'post',
    json: true,
    body: requestBody,
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
