const config = require('../config/config');
const io = require('socket.io-client')

socket = io.connect( config.client, {
    extraHeaders: {
        "x-device-id": config.deviceid
      },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
  });

socket.on('connect', (data) => {
    console.log("on connect");
    socket.emit('authentication', {authkey: config.secretkey});
    socket.on('authenticated', function(ok) {
      console.log(ok);
      console.log(`Socket connected id: ${socket.id}`);
      socket.emit('message');
      socket.on(config.secretkey, async function(data) {
          console.log("Got data from the server: ",data.body);
      });
    });
});
socket.on( 'disconnect', function (data) {
    console.log( 'disconnected from server' ,data);
  });