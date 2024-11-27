const controller = require('../controllers/serialPortController')
const router = require('express').Router()
const http = require('http');

const express = require("express");
const app = express()
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);


router.post('/connectArduino', (req, res) => {
    console.log("Client requested to trigger relay...");

    // Send command to Arduino to turn on the relay
    serialPort.write('TURN_ON_RELAY'); // Send command to Arduino to turn on the relay

    // Start streaming data from Arduino
    serialPort.on('data', (data) => {
        // Emit the data to all connected clients
        io.emit('arduinoData', data.toString());
    });

    // Send a response confirming the relay activation
    res.json({ message: 'Relay activated, streaming data from Arduino.' });

    // After a delay (or based on some condition), turn off the relay
    setTimeout(() => {
        console.log("Turning off the relay...");
        serialPort.write('TURN_OFF_RELAY'); // Send command to Arduino to turn off the relay
    }, 10000); // Keep relay on for 10 seconds, adjust as needed
})

module.exports = router