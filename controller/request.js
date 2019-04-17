'use strict'

const config = require('../config/config');

var requestPayload = async function (req, res) {
    try {
        var io
        var body = req.body;

        io = await require('./socket').getIo()
        console.log("Socket connected at requestpayload")

        if (req.headers['x-device-id'] == config.deviceid) {
            if (req.headers['x-secret-key'] == config.secretkey) {
                if (body) {
                    try {
                        io.emit(config.secretkey, {
                            "body": body,
                        })
                        console.log("Message body: ", body)
                        return res.status(200).send({
                            "msg": "Success"
                        })
                    } catch (ex) {
                        console.error("Could not able to connect websocket server ", ex)
                        return res.status(500).send({
                            "msg": "Could not able to connect websocket"
                        })
                    }
                } else {
                    console.error("No request body")
                    return res.status(400).send({
                        "msg": "No request body"
                    })
                }
            } else {
                console.error("No secret key ")
                return res.status(400).send({
                    "msg": "No secret key"
                })
            }
        } else {
            console.error("Device id required")
            return res.status(400).send({
                "msg": "Device id required"
            });
        }
    } catch (ex) {
        console.error("Internal server error", ex)
        return res.status(500).send({
            "msg": "Internal server error"
        });
    }
}


module.exports = {
    requestPayload: requestPayload
}