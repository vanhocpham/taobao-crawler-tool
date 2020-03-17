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
    const html = await axios.get( "https://detail.tmall.com/item.htm?id=557671415266&spm=a21wu.241046-global.4691948847.31.41cab6cbihbqnJ&scm=1007.15423.84311.100200300000001&pvid=fbc80eed-17a1-4252-b05b-adf3e0cb39a4&sku_properties=1627207:1659396112" );
    const $ = await cheerio.load(html.data);
    let link = [];

    const itemSideBar = $(".tb-thumb");
    const itemBody = $(".J_TSaleProp.tb-img ");
    if ( req.query.url.includes( "item.taobao.com" ) ) {
      itemSideBar.find("img").map( async ( index, element ) => {
        await link.push("http:"+element.attribs["data-src"].split("jpg")[0]+"jpg");
      } );
    } else {
      itemSideBar.find("img").map( async ( index, element ) => {
        await link.push("http:"+element.attribs["src"].split("jpg")[0]+"jpg");
      } );
    }
  
  

    itemBody.find("a").map( async ( index, element ) => {
      await link.push("http:"+ element.attribs["style"].split("(")[1].split(")")[0].split("jpg")[0]+"jpg")
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