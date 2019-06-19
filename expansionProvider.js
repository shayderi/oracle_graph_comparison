const request = require('request')
var neo4j = require('neo4j-driver').v1
const sampleResults = require('./sample1')
const config = require('./config')
const  { drop, chunk, flow, get, map } = require('lodash/fp');

const sample = () => new Promise((resolve) => {
  resolve(sampleResults)
})

const parseArgs = (typeValueArr) => (
  { 
    num_of_hops: typeValueArr[0],
    ids_to_expand: flow([
      drop(1),
      chunk(2),
      map((pair) => ({identifier_type: get(`[0]`, pair), identifier_value: get(`[1]`, pair)}))
    ])(typeValueArr),
    min_score: 0
  }
)

function fetchGraph(parsedArgs) {
  let driver
  try {
    driver = neo4j.driver(
      config.graphUrl, // TODO check URL at configuration
      neo4j.auth.basic('neo4j', 'HERE_COMES_PASS')
    )  
  } catch (error) {
    console.log(error)
  }
  

  const session = driver.session()
  return new Promise((resolve, reject) => {
    session
    .run('CALL raf.IExpander({parsedArgs})', {
      parsedArgs
    })
    .then(function(result) {
      resolve(result.records)
      session.close()
      driver.close()
    })
    .catch(function(error) {
      session.close()
      driver.close()
      console.log(error)
      reject(error)
    })
  })
}

function fetchOracle(body){
  const options = {
    url: config.oracleUrl,
    method: 'post',
    json: true,
    body
  };

  return new Promise((resolve, reject) => {
    
    request(config.oracleUrl, options, (err,response, body) => {
      if(err){
        reject("Failed fetch from Oracle")
      }
      resolve(body)
    })
  })
}

async function expandOracleAndGraph(typeValueArr) {

  const parsedArgs = parseArgs(typeValueArr)
  const results = await Promise.all([fetchOracle(parsedArgs), fetchGraph(parsedArgs)]);
  return results
}

module.exports = {
  sample,
  expandOracleAndGraph
}
