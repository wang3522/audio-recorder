const express = require('express');
var basicAuth = require('express-basic-auth');
var bodyParser = require("body-parser");
var request = require('request');
const app = express();
var config = require('../.audio-recorder-conf/config.json')

const accessToken =  config.access_token;
const apiUrl = "https://9k9kz5aqu0.execute-api.us-east-1.amazonaws.com/dev/presigned-upload";
var headers = {
	'authorization': 'Bearer '+ accessToken,
	'accept': 'application/json',
	'bucket': 'synaptics-training-data',
	'content-type': 'audio/wav'
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(basicAuth({
    challenge: true,
    users: { config.username: config.passwd }
}));

app.use(express.static('client'))
//app.use('/static', express.static(path.join(__dirname, 'client')));
//app.get('/',function(req,res){
//  res.sendFile('index.html', { root: __dirname  + '/client'});
//});


app.post('/upload',function(req,res){
	var filename=req.body.filename;
	console.log("requesting S3 url for " + filename);
	headers['object'] = filename;
	console.log("headers: ", headers);
	request({
		method: 'GET',
		uri: apiUrl,
		headers: headers
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var bodyUrl = JSON.parse(body);
			console.log('url:',  bodyUrl['upload_url'])
			res.set('Content-Type', 'application/json');
			res.send(body);
		}
	});
});


//app.use(express.static('client'))

app.listen(8000, () => console.log('Server running on port 8000'))


