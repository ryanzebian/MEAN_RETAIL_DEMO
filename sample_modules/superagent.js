var superagent = require('superagent');

superagent.get('http://www.google.com',function(err,res){
    console.log(res.status); //200 OK
    console.log(res.text); //HTML Google's Home Page
    process.exit(1);
});