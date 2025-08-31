const dotEnv = require('dotenv');
const path = require('path')
dotEnv.config({
    path: path.join(__dirname, '../config.env')
});

const app = require('./app');
const {dbConnection} = require("./utils/db");

process.on('uncaughtException', err => {
    console.log('uncaughtException', err.name, err.message);
    process.exit(1);
});

const rawPort = process.env.APP_PORT
console.log(rawPort)
const port = rawPort && !isNaN(Number(rawPort)) ? parseInt(rawPort, 10) : 5000;
if (port < 0 || port > 65535) {
    console.log(`INVALID APP_PORT: ${port}`);
    process.exit(1);
}

console.log(port)
let server;
const startServer = async () => {
    try {
        await dbConnection();
        server = app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });

        server.on('listening', () => {
            console.log(`Server is listening on port: ${port}`);
        });

        server.on('error', err => {
            console.log(`server.on-error`, err.name, err.message);
            process.exit(1);
        });
    } catch (err) {
        console.log("Failed to start", err)
        process.exit(1);
    }
}
startServer().then(null);

process.on('unhandledRejection', err => {
    console.log(`unhandledRejection`, err.name, err.message);
    server.close(() => process.exit(1));
});