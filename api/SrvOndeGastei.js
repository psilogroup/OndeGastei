var pmx = require('pmx').init({
  http : true
});
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var jwt  = require('jwt-simple');
var repo = require("./Repositorie");
var formidable = require("formidable");
var fs = require("fs");
var path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.methodOverride());
app.set('superSecret', "4d11fdfe461e4fbaa70770736eba166f");
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  
   var token = req.body.token || req.query.token || req.headers['authorization'];

  
  if (token) 
  {
      var decoded = jwt.decode(token, "4d11fdfe461e4fbaa70770736eba166f");
      req.userToken = decoded;
   
  }
  // Pass to next layer of middleware
  next();
});

repo.registerAll(router);


router.get("/", function (req, res) {
	res.json({ "erro": false, "mensagem": "Hoje e dia de alegria" });
});

app.use('/', router);
app.listen(8087);
console.log("Listening to port 8087 at 127.0.0.1");
