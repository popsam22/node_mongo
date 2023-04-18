const { MongoClient } = require('mongodb');

let dbConnection;
module.exports = {
    connectToDB: (callback) => {
        // MongoClient.connect('mongodb://localhost:27017/staff')
        MongoClient.connect('mongodb+srv://popsam22:N8vAMGlt281NZpbg@staff.ekbiaoy.mongodb.net/?retryWrites=true&w=majority')
            .then(client => {
                dbConnection = client.db();
                return callback();
            })
            .catch(err => {
                console.log(err);
                return callback(err);
            })

    }, //estabalish a connection to  database
    getDB: () => dbConnection //. returns our database connection after we've connected to it
}