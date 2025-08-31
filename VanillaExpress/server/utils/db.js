const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);
module.exports.dbConnection = async () => {
    const uri = process.env.DB_URL;
    if (!uri) throw new Error("Missing DB_URL");

    return mongoose.connect(uri, {serverSelectionTimeoutMS: 5000})
        .then(mongoose =>
                mongoose.connection.db.admin().ping()
                    .then(() => mongoose.connection))
        .then(conn => {
            const {name, port, host} = conn;
            console.log(`Mongo connected: ${host}:${port}/${name}`);
        })
        .catch(err => {
            console.log("Mongo error: ", err.message);
            throw err;
        });
}