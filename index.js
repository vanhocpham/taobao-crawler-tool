// configure server express
const bodyParser = require( "body-parser" );
const createError = require("http-errors")
const fs = require( "fs" );
const path = require( "path" );
const cors = require( "cors" );
const http = require( "http" );
const express = require( "express" ),
  app = express();
const logger = require( "morgan" );
const route = require( "./src/routes" );
const session = require( "express-session" );
const cookieParser = require( "cookie-parser" );
const flash = require( "connect-flash" );
const config = require("./src/config/config");
const helmet = require( "helmet" );
let server = null;


// config server with http of https
server = http.createServer( app );


// set server port
app.set( "port", config.PORT );

// handle cors
app.use( cors( {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "allowedHeaders": [ "Content-Type", "Authorization" ],
  "exposedHeaders": [ "Cookie" ] } ) );

// handle form data using bodyParser
app.use( bodyParser.json( { "extended": true } ) );
app.use( bodyParser.urlencoded( { "extended": false } ) );

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'secret',
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 6000000
  }
}));


// create log on server
app.use( logger( "dev" ) );

// helmet security
app.use( helmet() );

// view engine setup
app.use(express.static(__dirname + "/public"));
app.set( "views", path.join(__dirname, "public" ) )
app.set("view engine", "ejs" )
app.use(flash())


// create route views
app.use( "/", route );
// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   // next(createError(404))
//   res.redirect( "/404" )
// })


// listen a port
server.listen(config.PORT, () => {
  console.log( `Api server: process ${ process.pid } running ${config.PORT}` );
} );

module.exports = app;

