var pn532 = require('../src/pn532');
const { SerialPort } = require('serialport');
const serialPort = new SerialPort({ path: 'COM3', baudRate: 115200 });
var rfid = new pn532.PN532(serialPort, { pollInterval: 3000 });
var ndef = require('ndef');

console.log('Waiting for rfid ready event...');
rfid.on('ready', function() {

    console.log('Listening for a tag scan...');
    rfid.on('tag', function(tag) {
        console.log('Tag', tag);

        console.log('Authenticating...');
        // Autentica el bloque 4 (sector 1, bloque 0)
        rfid.authenticateBlock(tag.uid, { blockAddress: 4 }).then(function(authBody) {
            console.log('Authentication response:', authBody);
            // Si la autenticación fue exitosa, lee el bloque
            rfid.readBlock({ blockAddress: 4 }).then(function(data) {
                console.log('Tag block 4 data:', data);
                // Si quieres decodificar con ndef:
                // var records = ndef.decodeMessage(Array.from(data));
                // console.log(records);
            }).catch(function(err) {
                console.error('Error reading block:', err);
            });
        }).catch(function(err) {
            console.error('Authentication error:', err);
        });
    });
});
