var wagner = require('wagner-core');
var model = require('./schemas/model')(wagner);
var Product = model.Product;

Product.remove({},function(error){
    if(error){
        console.log(error);
        processs.exit(1);
    }
    process.exit(0);
});