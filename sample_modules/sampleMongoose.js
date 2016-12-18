const connectionString = "mongodb://localhost:27017/test";

mongoose.connect(connectionString, function (error) {
    if (error) {
        console.log(error);
        process.exit(1);
    }
});

var User = mongoose.model('User', require('./schemas/user'), 'users');
var ryan = new User({ name: 'Ryan' });
ryan.save(function (error, user) {
    process.exit(1);
});
var Product =  mongoose.model("Product",require('./schemas/product'),'products');

var product = new Product({name:'Sohat'});
product.price.amount = 500;
product.price.currency = 'USD';

product.save(function(error,product){
    if(error){
        console.log(error);
    }
    console.log('Added Product:'+product);
    process.exit(1);
});
var Category =  mongoose.model("Category",require('./schemas/category'),'categories');

Category.find({},function(error,category){
    if(error){
        console.log(error);
        process.exit(0);
    }
    console.log(category[0].parent);
    console.log(category);
    process.exit(1);
})
var electronics = new Category();
electronics._id = 'Electronics';
electronics.parent = 'Toys';
electronics.anscetors = ['Toys'];

electronics.save(function(error,electronics){
    if(error){
        console.log(error);
    }
    console.log(electronics);
    process.exit(1);
});