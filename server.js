var mongoose = require("mongoose");
mongoose.Promise = Promise;
const connectionString = "mongodb://localhost:27017/test";

mongoose.connect(connectionString,function(error){
    if(error){
        console.log(error);
        process.exit(1);
    }
});


var Product =  mongoose.model("Product",require('./schemas/product'),'products');

var product = new Product({name:'Sohat'});
product.price.amount = 500;
product.price.currency = 'LBP';

product.save(function(error,product){
    if(error){
        console.log(error);
    }
    console.log(product);
    process.exit(1);
});