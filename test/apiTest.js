var mocha = require('mocha');
var superagent = require('superagent');
var express = require('express');
var wagner = require('wagner-core');
var assert = require('assert');
var URL_ROOT = 'http://localhost:3000';
describe('Category API', function () {
    var server;
    var Category;

    before(function () {
        var app = express();

        //BootStrap server
        var models = require('./../schemas/model')(wagner);
        app.use(require('./../api')(wagner));

        server = app.listen(3000);;

        // Make Category model available in tests
        Category = models.Category;
    });
    after(function () {
        // Shut the server down when we're done
        server.close();
    });

    beforeEach(function (done) {
        Category.remove({}, function (error) {
            assert.ifError(error);
            done();
        });
    });
    ///category/id/:id
    it('can load category by id', function (done) {
        Category.create({ _id: 'Electronics' }, function (error, doc) {
            assert.ifError(error);
            var url = URL_ROOT + '/category/id/Electronics';
            //Make an http request to localhost:3000/category/id/Electronics
            superagent.get(url, function (err, res) {
                assert.ifError(err);
                var result;
                assert.doesNotThrow(function () {
                    result = JSON.parse(res.text);
                });
                assert.ok(result.category);
                assert.equal(result.category._id, 'Electronics');
                done();
            })
        });
    });

    it('can load all categories that have a certain parent', function (done) {
        var categories = [
            {_id:'Electronics' },
            {_id:'Phones',parent:'Electronics'},
            {_id:'Laptops',parent:'Electronics'},
            {_id:'Bacon'}
        ];
        Category.create(categories,function(error){
            assert.ifError(error);

            //http://localhost/category/parent/Electronics
            var url = URL_ROOT + '/category/parent/Electronics';
            superagent.get(url,function(err,res){
                assert.ifError(err);
                var result;
                assert.doesNotThrow(function(){
                result = JSON.parse(res.text);
                });
                assert.equal(result.categories.length,2);
                //Should be in ascending order
                assert.equal(result.categories[0]._id,'Laptops');
                assert.equal(result.categories[1]._id,'Phones');
                
                done();
            });
        });
        
    });
});