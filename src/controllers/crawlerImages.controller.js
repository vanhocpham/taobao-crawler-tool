const request = require( "request-promise" );
const cheerio = require( "cheerio" );

const getPageContent = (uri) => {
  const options = {
    uri,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    transform: (body) => {
      return cheerio.load(body)
    }
  };

  return request(options)
    .then(($) => {
      return {
        $,
        uri,
      }
    })
};

module.exports = {
  "index": async ( req, res ) => {
    
  }
};