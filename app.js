const http = require('http');
const express = require('express');
const jsonData = require('./rfid_stream_data.json');
const webhookUrl = 'http://localhost:3001/webhook';

let currentIndex = 0;

function sendData() {
  if (currentIndex >= jsonData.length) {
    currentIndex = 0;
  }

  const dataToSend = [jsonData[currentIndex]]; // Wrap the current data object in an array

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(webhookUrl, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Data sent:', dataToSend);
      currentIndex++;
      setTimeout(sendData, 1000); // Delay execution by 1 second before sending the next item
    });
  });

  req.on('error', (error) => {
    console.log('Failed to send data:', error.message);
  });

  req.write(JSON.stringify(dataToSend));
  req.end();
}

sendData();

const app = express();
const port = 4000; // Change the port number if needed

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
