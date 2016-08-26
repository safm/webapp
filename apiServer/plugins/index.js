var config = require( "./../config/config" );
var restify = require( "restify" );
var plugins = [];

//load custom plugins
var _httpSimpleAuthentication = require( "./_httpSimpleAuthenticate" );



module.exports = function ( server ) {
    //adding non-conditional plugins
    plugins.push( restify.acceptParser( server.acceptable ), restify.throttle( config.server.throttling ), restify.queryParser() );


    //adding conditional plugins
    if ( config.security.basicHttpAuth || config.security.oAuthEnabled ) {
        plugins.push( restify.authorizationParser(),
            restify.bodyParser( {
                mapParams: false
            } ) );
    }

    if ( config.security.basicHttpAuth ) {
        plugins.push( _httpSimpleAuthentication );
    }

    return plugins;
};