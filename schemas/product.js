var mongoose = require('mongoose');
var Category = require('./category');
var fx = require('./helper_methods/fx');
const currencySymbols = {
    'USD': '$',
    'LBP': 'LBP',
    'EUR': '%',
    'GBP': '&'
};

var productSchema = {
    name: { type: String, required: true },
    pictures: [{ type: String, match: /^http:\/\//i }],
    price: {
        amount: {
            type: Number,
            required: true
            ,
            set: function (v) {
                this.internal.approximatePriceUSD = v / (fx()[this.currency] || 1);
                return v;
            }
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'LBP'],
            required: true
            ,
            set: function (v) {
                this.internal.approximatePriceUSD = this.price.amount / (fx()[v] || 1);
                return v;
            }
        }
    },
    category: Category.categorySchema,
    internal: {
        approximatePriceUSD: Number
    }
};

var schema = new mongoose.Schema(productSchema);
schema.virtual('displayPrice').get(function () {
    return currencySymbols[this.price.currency] + '' + this.price.amount;
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });


module.exports = schema;
module.exports.productSchema = productSchema;