const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
      let dbOp;
      if (this._id) {
          dbOp = getDb().collection('products').updateOne({_id:this._id}, {$set: this});
      } else {
          dbOp = getDb().collection('products').insertOne(this);
      }
    return dbOp
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
  };

  static fetchAll() {
      return getDb().collection('products').find().toArray()
          .then(products => {
              console.log(products);
              return products;
          })
          .catch(err => {
              console.log(err);
          });
  };

  static findById(prodId) {
    return getDb().collection('products').findOne({_id: new mongodb.ObjectId(prodId)})
        .then(product => {
            console.log(product);
            return product;
        })
        .catch(err => {
            console.log(err);
        })
  };

  static deleteById(prodId) {
      return getDb().collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
          .then(result => {
              console.log('Deleted');
          })
          .catch(err => {
              console.log(err);
          })
  };

}

module.exports = Product;