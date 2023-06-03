const http = require('http');
const express = require('express');

const jsonData = require('./rfid_stream_data.json');

const webhookUrl = 'http://localhost:5000/webhook';

let currentIndex = 0;

function sendData() {
  if (currentIndex >= jsonData.length) {
    currentIndex = 0;
  }

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
      console.log('Data sent:', jsonData[currentIndex]);
      currentIndex++;
      setTimeout(sendData, 1000); // Delay execution by 1 second before sending the next item
    });
  });

  req.on('error', (error) => {
    console.log('Failed to send data:', error.message);

  });

  req.write(JSON.stringify(jsonData[currentIndex]));
  req.end();
}

sendData();

const app = express();
const port = 3000; // Change the port number if needed

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
