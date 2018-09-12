const express = require('express');
var basicAuth = require('express-basic-auth');
var bodyParser = require("body-parser");
const app = express();
var request = require('request');

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzY1ODk1MTYsImlkIjoiZjEwMjk0YTktMTc3NS00NGMyLThmMzgtOWYwOTEzNmYzM2IzIiwiZXhwIjoxNTUyMTQxNTE2fQ.4E2v0Yd7VE5NTfnWTRYH3CblRKMfYZM5ekWEeEGASto";

const apiUrl = "https://9k9kz5aqu0.execute-api.us-east-1.amazonaws.com/dev/presigned-upload";
var headers = {
	'authorization': 'Bearer '+ accessToken,
	'accept': 'application/json',
	'bucket': 'synaptics-training-data'
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(basicAuth({
    challenge: true,
    users: { 'yummly': 'openforme' }
}));

app.use('/static', express.static(path.join(__dirname, 'client')));
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
			res.send(bodyUrl['upload_url']);
		}
	});
});


//app.use(express.static('client'))

app.listen(8000, () => console.log('Server running on port 8000'))


