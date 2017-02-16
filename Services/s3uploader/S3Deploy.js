var BUCKET_NAME = 'expensepsilogroupbucket';
var fs = require('fs');
var aws = require('aws-sdk');
aws.config.loadFromPath('./AwsConfig.json');
var s3 = new aws.S3();

if (process.argv.length < 3) noParamsGiven();
else runWithParams();


function noParamsGiven() {
  showUsage();
  process.exit(-1);
}


function runWithParams() {
  console.log('S3 Deployer ... running option is [' + process.argv[2] + ']');

  if (process.argv[2] === 'enviar') enviar();
  else console.log('...that option isn\'t recognized');
}

function enviar()
{
 var data = new Date();
 var ano = data.getFullYear();
 var mes = data.getMonth()+1;
 var dia = data.getDate();
 var fileName = process.argv[3].replace(/^.*[\\\/]/, '')
 var remoteFileName= ano+"/"+mes+"/"+dia+"/"+fileName;
 console.log("Remote: "+remoteFileName+", Local: "+process.argv[3]);
 //uploadFile(remoteFileName,process.argv[3]);
}
function uploadCss() {
  var CODE_PATH = 'resources/css/';
  var fileList = getFileList('./' + CODE_PATH);

  fileList.forEach(function(entry) {
    uploadFile(CODE_PATH + entry, './' + CODE_PATH + entry);
  });
}

function getFileList(path) {
  var i, fileInfo, filesFound;
  var fileList = [];

  filesFound = fs.readdirSync(path);
  for (i = 0; i < filesFound.length; i++) {
    fileInfo = fs.lstatSync(path + filesFound[i]);
    if (fileInfo.isFile()) fileList.push(filesFound[i]);
  }

  return fileList;
}


function uploadFile(remoteFilename, fileName) {
  var fileBuffer = fs.readFileSync(fileName);
  var metaData = getContentTypeByFile(fileName);

  s3.putObject({
    ACL: 'public-read',
    Bucket: BUCKET_NAME,
    Key: remoteFilename,
    Body: fileBuffer,
    ContentType: metaData
  }, function(error, response) {
    console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
    console.log(arguments);
  });
}


function getContentTypeByFile(fileName) {
  var rc = 'application/octet-stream';
  var fileNameLowerCase = fileName.toLowerCase();

  if (fileNameLowerCase.indexOf('.html') >= 0) rc = 'text/html';
  else if (fileNameLowerCase.indexOf('.css') >= 0) rc = 'text/css';
  else if (fileNameLowerCase.indexOf('.json') >= 0) rc = 'application/json';
  else if (fileNameLowerCase.indexOf('.js') >= 0) rc = 'application/x-javascript';
  else if (fileNameLowerCase.indexOf('.png') >= 0) rc = 'image/png';
  else if (fileNameLowerCase.indexOf('.jpg') >= 0) rc = 'image/jpg';

  return rc;
}


function createBucket(bucketName) {
  s3.createBucket({Bucket: bucketName}, function() {
    console.log('created the bucket[' + bucketName + ']')
    console.log(arguments);
  });
}


function showUsage() {
  console.log('Use choosing one of these command line parameters:');
  console.log('  audio folderName');
  console.log('  code');
  console.log('  createBucket');
  console.log('  css');
  console.log('  index');
  console.log('  images');
  console.log('  list');
}
