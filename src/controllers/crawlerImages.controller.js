const cheerio = require( "cheerio" );
const axios = require( "axios" );
const downloader = require('image-downloader');
const path = require( "path" );
const fs = require("fs");
const AdmZip = require('adm-zip');
const config = require( "../config/config" );
const rimraf = require("rimraf");
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
    const html = await axios.get( req.body.inputLink.trim() );
    const $ = await cheerio.load(html.data);
    let link = [];

    const itemSideBar = $(".tb-thumb");
    const itemBody = $(".J_TSaleProp.tb-img ");
    const zip = new AdmZip();

    if ( req.body.inputLink.trim().includes( "item.taobao.com" ) ) {
      // Get all link image on side bar with item.taobao.com
      itemSideBar.find("img").map( async ( index, element ) => {
        let itemUrl = element.attribs["data-src"].includes( "jpg" ) && element.attribs["data-src"].includes( "png" ) || element.attribs["data-src"].includes( "png" ) ? element.attribs["data-src"].split("png")[0]+"png" : element.attribs["data-src"].split("jpg")[0]+"jpg";
        if ( itemUrl.includes( "50x50" ) ) { itemUrl = itemUrl.replace( "50x50", "800x800" ) }

        await link.push("http:"+ itemUrl );
      } );
    } else {      
      // Get all link image on side bar with shop.Tmall.com
      itemSideBar.find("img").map( async ( index, element ) => {
        let itemUrl = element.attribs["src"].includes( "jpg" ) && element.attribs["src"].includes( "png" ) || element.attribs["src"].includes( "png" ) ? element.attribs["src"].split("png")[0]+"png" : element.attribs["src"].split("jpg")[0]+"jpg";
        if ( itemUrl.includes( "50x50" ) ) { itemUrl = itemUrl.replace( "50x50", "800x800" ) }
        await link.push("http:"+ itemUrl);
      } );
    }

    // Get url image from description
    itemBody.find("a").map( async ( index, element ) => {
      let itemUrl = element.attribs["style"].split("(")[1].split(")")[0].includes( "jpg" ) && element.attribs["style"].split("(")[1].split(")")[0].includes( "png" ) || element.attribs["style"].split("(")[1].split(")")[0].includes( "png" ) ? element.attribs["style"].split("(")[1].split(")")[0].split("png")[0]+"png" : element.attribs["style"].split("(")[1].split(")")[0].split("jpg")[0]+"jpg";
      if ( itemUrl.includes( "40x40" ) ) { itemUrl = itemUrl.replace( "50x50", "800x800" ) }
      await link.push("http:"+ itemUrl)
    } );
    
    // remove link image duplicate
    link = [...new Set( link )]

    // create folder if it not exist
    if ( fs.existsSync(config.FOLDER)) {
      await rimraf(config.FOLDER, async () => { 
        console.log("done");
        await fs.mkdirSync( config.FOLDER );
       });
    }
    if ( !fs.existsSync(config.FOLDER)) { 
      await fs.mkdirSync( config.FOLDER );
    }

    // download
    await Promise.all( link.map( async (item) => {
      const { filename, image} = await downloader.image({
        url: item,
        dest: config.FOLDER
      })
      return filename
    } ) );
    
    zip.addLocalFolder(config.FOLDER);
    zip.writeZip(config.ZIP);

    return res.download( config.ZIP );
  }
};