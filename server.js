var wagner = require('wagner-core');
var express = require('express');

require('./schemas/model')(wagner);
require('./dependencies')(wagner);
var app = express();

wagner.invoke(require('./auth'),{app:app});

app.use('/api/v1/', require('./api')(wagner));
app.use(express.static('./src/')); //give express static ,{maxAge:'2h'}
app.listen(3000);
console.log('Listening to Port 3000!');