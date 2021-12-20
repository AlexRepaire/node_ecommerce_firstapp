const mongodb = require('mongodb');
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }

    save() {
        return getDb().collection('users').insertOne(this)
    }

    static findById(userId) {
        return getDb().collection('users').findOne({_id: new ObjectId(userId)})
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            })

    }


}

module.exports = User;