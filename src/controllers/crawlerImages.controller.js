const cheerio = require( "cheerio" );
const axios = require( "axios" );
const downloader = require('image-downloader');
const path = require( "path" );
const fs = require("fs");

let downloadImage = async ( url, dest ) => {  
  const stream = path.resolve( dest)
  const writer = fs.createWriteStream(stream)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
};

module.exports = {
  "index": async ( req, res ) => {
    const html = await axios.get( "http://localhost:8686/test" );
    const $ = await cheerio.load(html.data);
    let link = [];

    const itemSideBar = $(".tb-thumb");
    const itemBody = $(".J_TSaleProp.tb-img ");

    if ( req.query.url.includes( "item.taobao.com" ) ) {
      // Get all link image on side bar with item.taobao.com
      itemSideBar.find("img").map( async ( index, element ) => {
        let itemUrl = element.attribs["data-src"].includes( "jpg" ) && element.attribs["data-src"].includes( "png" ) || element.attribs["data-src"].includes( "png" ) ? element.attribs["data-src"].split("png")[0]+"png" : element.attribs["data-src"].split("jpg")[0]+"jpg";
        await link.push("http:"+ itemUrl );
      } );
    } else {      
      // Get all link image on side bar with shop.Tmall.com
      itemSideBar.find("img").map( async ( index, element ) => {
        let itemUrl = element.attribs["src"].includes( "jpg" ) && element.attribs["src"].includes( "png" ) || element.attribs["src"].includes( "png" ) ? element.attribs["src"].split("png")[0]+"png" : element.attribs["src"].split("jpg")[0]+"jpg";
        await link.push("http:"+ itemUrl);
      } );
    }
  
  

    itemBody.find("a").map( async ( index, element ) => {
      let itemUrl = element.attribs["style"].split("(")[1].split(")")[0].includes( "jpg" ) && element.attribs["style"].split("(")[1].split(")")[0].includes( "png" ) || element.attribs["style"].split("(")[1].split(")")[0].includes( "png" ) ? element.attribs["style"].split("(")[1].split(")")[0].split("png")[0]+"png" : element.attribs["style"].split("(")[1].split(")")[0].split("jpg")[0]+"jpg";
      await link.push("http:"+ itemUrl)
    } );
    
    link = [...new Set( link )]

    //  /home/hocpv/Desktop/
    link.map( async (item) => {
      await downloader({
        url: item,
        dest: "/home/hocpv/Desktop/test"
      })
      // await downloadImage( item, "/home/hocpv/Desktop/test");
    } );
   
   

    // console.log( link );
    res.render( "index" );
  }
};