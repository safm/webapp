module.exports = {
  "app": {
    "name": "restify-boilerplate"
  },
  "server": {
    "name": "localhost.sarfaraz.net",
    "port": 1214,
    "throttling": {
      "rate": 50,
      "burst": 100,
      "ip": true,
      "username": false
    }
  },
  "staticFilesPath": {
    "uploadImages": "../../assets/images/",
    "imagePath": "http://static.localhost.sarfaraz.net:1215/images/"
  },
  "security": {
    "basicHttpAuth": false, //you don't want both HTTPS & OAUTH. Enable only 1.
    "httpsEnabled": false,
    "oAuthEnabled": true //you don't want both HTTPS & OAUTH. Enable only 1.
  }
}