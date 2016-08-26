var _ = require( "underscore" );
var uuid = require( "uuid" );

var database = {
    clients: {
        officialApiClient: {
            secret: "C0FFEE"
        },
        unofficialClient: {
            secret: "DECAF"
        }
    },
    tokensToClientIds: {}
};

function generateToken( data ) {
    return uuid.v4()
}

function grantClientToken( credentials, req, cb ) {
    var isValid = _.has( database.clients, credentials.clientId ) &&
        database.clients[ credentials.clientId ].secret === credentials.clientSecret;
    if ( isValid ) {
        // If the client authenticates, generate a token for them and store it so `exports.authenticateToken` below
        // can look it up later.

        var token = generateToken( credentials.clientId + ":" + credentials.clientSecret );
        database.tokensToClientIds[ token ] = credentials.clientId;

        // Call back with the token so Restify-OAuth2 can pass it on to the client.
        return cb( null, token );
    }

    // Call back with `false` to signal the username/password combination did not authenticate.
    // Calling back with an error would be reserved for internal server error situations.
    cb( null, false );
};

function authenticateToken( token, req, cb ) {
    if ( _.has( database.tokensToClientIds, token ) ) {
        // If the token authenticates, set the corresponding property on the request, and call back with `true`.
        // The routes can now use these properties to check if the request is authorized and authenticated.
        req.clientId = database.tokensToClientIds[ token ];
        return cb( null, true );
    }

    // If the token does not authenticate, call back with `false` to signal that.
    // Calling back with an error would be reserved for internal server error situations.
    cb( null, false );
};

module.exports = {
    grantClientToken: grantClientToken,
    authenticateToken: authenticateToken
}