var restify = require( "restify" );
var path = require( "path" );
var fs = require( "fs" );
var config = require( "./config/config" );

var plugins = require( path.join( __dirname, "/plugins/" ) );
var routes = require( path.join( __dirname, "/routes/" ) );

var serverOptions = {
    name: config.server.name
};

//if HTTPS is enabled in config then add key & certificate options
//if oauth is enabled then by default make HTTPS
if ( config.security.httpsEnabled || config.security.oAuthEnabled ) {
    serverOptions.key = fs.readFileSync( path.join( __dirname, "/config/key.pem" ) );
    serverOptions.certificate = fs.readFileSync( path.join( __dirname, "/config/cert.pem" ) );
}

//create server
var server = restify.createServer( serverOptions );

//add plugins to the server
server.use( plugins( server ) );

//check to enable oAuth
if ( config.security.oAuthEnabled ) {
    //read more about this plugin here: 
    var restifyOAuth2 = require( "restify-oauth2" );

    //this is required by the restify-oauth2 plugin
    server.formatters[ "application/hal+json" ] = function formatHalJSON( req, res, body, cb ) {
        return res.formatters[ "application/json" ]( req, res, body, cb );
    }

    var oauthOptions = {
        tokenEndpoint: "/token",
        hooks: require( "./helpers/ccHooks" )
    };
    restifyOAuth2.cc( server, oauthOptions );
}

//register the routes
routes( server );

server.listen( config.server.port, function () {
    console.log( "%s now listening on https://%s:%s\n", config.app.name, config.server.name, config.server.port );
    console.log( "\n%s\n", server.url );
} );