const express = require('express')
var basicAuth = require('express-basic-auth');
const app = express()

app.use(basicAuth({
    challenge: true,
    users: { 'yummly': 'openforme' }
}));
//app.get('/', (req, res) => {
//  res.send('HEY!')
//})
app.use(express.static('demo'))

app.listen(8000, () => console.log('Server running on port 8000'))


