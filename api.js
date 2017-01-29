var express = require('express');
var status = require('http-status');
var bodyparser = require('body-parser');
var _ = require('underscore');
module.exports = function (wagner) {
    var api = express.Router();
    api.use(bodyparser.json());
    //User Cart API
    api.put('/me/cart', wagner.invoke(function (User) {
        return function (req, res) {
            try {
                var cart = req.body.data.cart;

            } catch (e) {
                return res.
                    status(status.BAD_REQUEST).
                    json({ error: 'No cart specified' });
            }
            req.user.data.cart = cart;
            req.user.save(function (error, user) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString() });
                }
                return res.json({ user: user });
            });
        };
    }));
    api.get('/me', function (req, res) {
        if (!req.user) {
            return res.
                status(status.UNAUTHORIZED)
                .json({ error: 'Not logged in' });
        }
        req.user.populate({
            path: 'data.cart.product', model: 'Product'
        }, handleOne.bind(null, 'user', res));
    });
    api.get('/product/text/:query', wagner.invoke(function (Product) {
        return function (req, res) {
            Product.
                find(
                { $text: { $search: req.params.query } },
                { score: { $meta: 'textScore' } }).
                sort( { score: { $meta: 'textScore'}}).
                limit(10).
                exec(handleMany.bind(null, 'products', res));
                
        }
        
    }));
    api.post('/checkout', wagner.invoke(function (User, Stripe) {
        return function (req, res) {
            if (!req.user) {
                return res.
                    status(status.UNAUTHORIZED).
                    json({ error: 'Not logged in' });
            }
            //populate the products in the user's cart 
            req.user.populate({ path: 'data.cart.product', model: 'Product' }, function (error, user) {
                //Sum up the total price in USD
                var totalCostUSD = 0;
                _.each(user.data.cart, function (item) {
                    totalCostUSD += item.product.internal.approximatePriceUSD * item.quantity
                });
                // And Create a charge in stripe corresponding to the price
                Stripe.charges.create({
                    //Stripe wants price in cents, so multiply by 100 and round up
                    amount: Math.ceil(totalCostUSD * 100),
                    currency: 'usd',
                    source: req.body.stripeToken,
                    description: 'Example Charge'
                }, function (err, charge) {
                    if (err && err.type == 'StripeCardError')
                        return res.
                            status(status.BAD_REQUEST).
                            json({ error: err.toString() });
                    if (err) {
                        console.log(err);
                        return res.
                            status(status.INTERNAL_SERVER_ERROR).
                            json({ error: err.toString() });
                    }
                    req.user.data.cart = [];
                    req.user.save(function () {
                        //Ignore errors-if we failed to empty the user's
                        // cart, that's not necssairly a failure 
                        //if sucessful
                        return res.json({ id: charge.id });
                    });
                });
            });
        }
    }));
    return api;
}

function handleOne(property, res, error, result) {
    if (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
    }
    if (!result) {
        return res.status(status.NOT_FOUND).
            json({ error: "Not Found" });
    }
    var json = {};
    json[property] = result;
    res.json(json);
}
function handleMany(property, res, error, results) {
    if (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
    }
    var json = {};
    json[property] = results;
    res.json(json);
}