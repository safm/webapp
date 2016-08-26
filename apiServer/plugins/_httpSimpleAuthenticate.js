var authorizedKeys = {
    "myUserName": "myPassword",
    "myOtherUserName": "myOtherPassword"
};
var restify = require( "restify" );


module.exports = function ( req, res, next ) {
    var authorizationHeader = req.authorization;
    if ( !authorizationHeader || !authorizationHeader.basic || !authorizationHeader.basic.username || authorizedKeys[ authorizationHeader.basic.username ] !== authorizationHeader.basic.password ) {
    	return next( new restify.NotAuthorizedError( "Invalid Credentials" ) );
    }
    return next();
}