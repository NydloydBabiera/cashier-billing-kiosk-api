const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline'); // This is used to read data line by line
const EventEmitter = require('events'); // EventEmitter to emit serial data events

// Path to the Arduino serial port (change based on your system)
const serialPort = new SerialPort({
  path: 'COM4',  // For Linux/Mac, you can use '/dev/ttyUSB0' or '/dev/ttyACM0'
  baudRate: 9600,         // Baud rate should match Arduino's baud rate
});

// Create a parser to read data line by line from the serial port
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Create an event emitter instance for emitting serial data
class SerialPortEmitter extends EventEmitter {}
const serialPortEmitter = new SerialPortEmitter();

// When the serial port is opened
serialPort.on('open', () => {
  console.log('Serial Port Opened');
});

// Listen for data from the Arduino
parser.on('data', (data) => {
  console.log('Received data from Arduino:', data);  // Log the received data
  serialPortEmitter.emit('data', data);  // Emit the data to the listeners
});

// Handle error events from the serial port
serialPort.on('error', (err) => {
  console.error('Error in Serial Port:', err);
});

// Function to write data to the Arduino
const writeDataToArduino = (data) => {
  console.log(`Sending data to Arduino: ${data}`);
  serialPort.write(data, (err) => {
    if (err) {
      console.log('Error on write:', err.message);
    }
  });
};

// Export the serial port emitter and write function
module.exports = {
  serialPortEmitter,
  writeDataToArduino
};
