const express = require('express');
var basicAuth = require('express-basic-auth');
var bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(basicAuth({
    challenge: true,
    users: { 'yummly': 'openforme' }
}));


app.get('/',function(req,res){
  res.sendFile('index.html', { root: __dirname  + '/client'});
});


app.post('/upload',function(req,res){
  var filename=req.body.filename;
  console.log("filename = " + filename);
  res.send("yes");
});


//app.use(express.static('client'))

app.listen(8000, () => console.log('Server running on port 8000'))


