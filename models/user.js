const mongodb = require('mongodb');
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    };

    save() {
        return getDb().collection('users').insertOne(this)
    };

    addToCart(product) {
          const cartProductIndex = this.cart.items.findIndex(cp => {
              return cp.productId.toString() === product._id.toString();
          });
          let newQuantity = 1;
          const updatedCartItems = [...this.cart.items];

          if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
          } else {
              updatedCartItems.push({
                  productId: new ObjectId(product._id),
                  quantity: newQuantity
              })
          }

          const updatedCart = {items: updatedCartItems};
          return getDb().collection('users').updateOne(
              {_id: new ObjectId(this._id)},
              {$set: {cart: updatedCart}}
          )
    };

    getCart() {
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return getDb().collection('products').find({_id: {$in: productIds}}).toArray()
            .then(products => {
                return products.map(p => {
                    return {...p, quantity: this.cart.items.find(i => {
                        return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                })
            });
    };

    static findById(userId) {
        return getDb().collection('users').findOne({_id: new ObjectId(userId)})
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            })

    };

}

module.exports = User;