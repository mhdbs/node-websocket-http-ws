const config = require('../config/config');
const redis = require('socket.io-redis');
var io = null;

function checkAuthentication(io) {
    require('socketio-auth')(io, {
        authenticate: function (socket, data, callback) {
            console.log("from client", data, socket.handshake.headers["x-device-id"]);
            let client_id = socket.handshake.headers['x-device-id'];
            var authkey = data.authkey;
            if (client_id === config.deviceid) {
                if (authkey === config.secretkey) {
                    console.log("Authenticated")
                    return callback(null, true)
                } else {
                    console.error("Unauthorized")
                    return callback(null, false)
                }
            } else {
                console.error("Unauthorized")
                return callback(null, false)
            }
        }
    })
}

function socketobject(server) {
    return new Promise(async function (resolve, reject) {
        try {
            io = require('socket.io')(server);
            io.adapter(redis({
                host: config.redis_url,
                port: config.redis_port
            }));
            io = io.of('/');

            io.on('connection', async function (socket) {
                await checkAuthentication(io)
                console.debug(`${socket.id} connected`);
                socket.on('message', async function (data) {
                    let job_server = socket.handshake.headers["x-device-id"]
                    if (job_server === config.deviceid) {
                        socket.join(config.secretkey);
                        resolve(io)
                    } else {
                        console.error("Invalid token")
                        return reject("Unauthorized")
                    }
                })
                socket.on('disconnect', function () {
                    console.log("client disconnected: ", socket.id);
                });
            })
            return resolve(io)
        } catch (ex) {
            console.error("Socket error: ", ex)
            return reject(ex)
        }
    });
}

function getIo() {
    return new Promise((resolve) => {
        resolve(io)
    })
}

module.exports = {
    io: io,
    socketobject: socketobject,
    getIo: getIo
}