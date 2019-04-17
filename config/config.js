
require('dotenv').config();
const REDIS_URL = process.env.REDIS_URL || "localhost"
const REDIS_PORT = process.env.REDIS_PORT || 6379
const CLIENT = process.env.CLIENT_SOCKET || "http://localhost:3000"
const DEVICE_ID = process.env.DEVICE_ID || "testdevice" 
const SECRET_KEY = process.env.SECRET_KEY || "testsecret"

module.exports = {
    redis_url: REDIS_URL,
    redis_port: REDIS_PORT,
    client: CLIENT,
    deviceid: DEVICE_ID,
    secretkey : SECRET_KEY
}