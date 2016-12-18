var mongoose = require('mongoose');
var _ = require("underscore");

function setupDB(wagner) {
    mongoose.connect('mongodb://localhost:27017/test');
    mongoose.Promise = Promise;
    var Category =
        mongoose.model('Category', require('./category'), 'categories');
    var Product =
        mongoose.model('Product', require('./product', 'products'));
    var User =
        mongoose.model('User', require('./user', 'users'));
    var models = {
        Category: Category,
        Product: Product,
        User: User
    };

    //To ensure DRY-Principle
    _.forEach(models, function (value, key) {
        wagner.factory(key, function () {
            return value;
        });
    });
    return models;
}
module.exports = setupDB;