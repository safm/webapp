var fs = require( "fs" );
var config = require( "./../config/config" );
var path = require( "path" );

var widgets = [ {
    name: "widget 1"
}, {
    name: "widget 2"
} ];

function getWidgets( req, res, next ) {
    if ( !req.clientId ){
        return res.sendUnauthenticated();
    }
    res.send( 200, widgets );
}

function addWidgets( req, res, next ) {
    var imageName = "default.png",
        widget = {
            name: req.body.name
        };
    if ( req.files.image ) {
        fs.readFile( req.files.image.path, function ( err, data ) {
            //handle case where imageName is found (error)
            imageName = req.files.image.name || imageName;
            var newPath = path.normalize( path.join( __dirname, config.staticFilesPath.uploadImages + imageName ) );
            fs.writeFile( newPath, data, function ( err ) {
                if ( err ) {
                    res.send( err );
                } else {
                    widget.image = config.staticFilesPath.imagePath + imageName;
                    widgets.push( widget );
                    res.send( 201, widgets );
                }
            } );
        } );
    } else {
        widget.image = config.staticFilesPath.imagePath + imageName;
        widgets.push( widget );
        res.send( 201, widgets );
    }
}


var PATH = '/widgets';
module.exports = function ( server ) {
    server.get( {
        path: PATH
    }, getWidgets );
    server.post( {
        path: PATH
    }, addWidgets );
}