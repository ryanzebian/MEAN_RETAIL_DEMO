var superagent = require('superagent');
var express = require('express');
var wagner = require('wagner-core');
var assert = require('assert');

var URL_ROOT = 'http://localhost:3000';

describe('Category API', function () {
    var server;
    var Category;
    var Product;
    before(function () {
        var app = express();

        //BootStrap server
        var models = require('./../schemas/model')(wagner);

        app.use(require('./../api')(wagner));

        server = app.listen(3000);;

        // Make Category model available in tests
        Category = models.Category;
        Product = models.Product;
    });
    after(function () {
        // Shut the server down when we're done
        server.close();
    });

    beforeEach(function (done) {
        Category.remove({}, function (error) {
            assert.ifError(error);
            Product.remove({}, function (error) {
                assert.ifError(error);
                done();
            });
        });
    });
    it('can load product by id', function (done) {
        //create a single product
        var PRODUCT_ID = '000000000000000000000001';
        var product = {
            name: "LG G4",
            _id: PRODUCT_ID,
            price: {
                amount: 300,
                currency: 'USD'
            }
        };
        Product.create(product, function (error, doc) {
            assert.ifError(error);
            var url = URL_ROOT + '/product/id/' + PRODUCT_ID;
            //Make an http request to localhost:3000/category/id/Electronics
            superagent.get(url, function (err, res) {
                assert.ifError(err);
                var result;
                assert.doesNotThrow(function () {
                    result = JSON.parse(res.text);
                });
                assert.ok(result.product);
                assert.equal(result.product.id, PRODUCT_ID);
                assert.equal(result.product.name, 'LG G4');
                done();
            });
        });
    });
    it('can load products in a category with sub-categories', function (done) {
        var categories = [
            { _id: 'Electronics' },
            { _id: 'Phones', parent: 'Electronics' },
            { _id: 'Laptops', parent: 'Electronics' },
            { _id: 'Bacon' }
        ];

        var products = [
            {
                name: 'LG G4',
                category: { _id: 'Phones', ancestors: ['Phones', 'Electronics'] },
                price: {
                    amount: 300,
                    currency: 'USD'
                }
            },
            {
                name: 'Asus Zenbook Prime',
                category: { _id: 'Laptops', ancestors: ['Laptops', 'Electronics'] },
                price: {
                    amount: 2000,
                    currency: 'USD'
                }
            }, {
                name: 'Flying Pigs Farm Pasture Raised Pork',
                category: { _id: 'Bacon', anscestors: ['Bacon'] },
                price: {
                    amount: 20,
                    currency: 'USD'
                }
            }
        ];
        //Create 4 Categories
        Category.create(categories, function (error, categories) {
            assert.ifError(error);
            //And 3 Products
            Product.create(products, function (error, products) {
                assert.ifError(error);

                var url = URL_ROOT + '/product/category/Electronics';
                superagent.get(url, function (error, res) {
                    assert.ifError(error);
                    var result;
                    assert.doesNotThrow(function () {
                        result = JSON.parse(res.text);
                    });
                    assert.equal(result.products.length, 2);
                    assert.equal(result.products[0].name, 'Asus Zenbook Prime');
                    assert.equal(result.products[1].name, 'LG G4');
                    done();
                });
            })
        })
    });
});