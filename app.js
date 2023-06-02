const axios = require('axios');
const express = require('express');

const jsonData = require('./rfid_stream_data.json');

const webhookUrl = 'http://localhost:5000/webhook';

let currentIndex = 0;

function sendData() {
  
  if (currentIndex >= jsonData.length) {
    currentIndex = 0;
    
  }

  var items = []

  items.push(jsonData[currentIndex]);
  
  axios.post(webhookUrl, items)
    .then(response => {
      console.log('Data sent:', items);
      currentIndex++;
      
      setTimeout(sendData, 1000); // Delay execution by 1 second before sending the next item
    })
    .catch(error => {
      console.error('Failed to send data:', error.message);
      currentIndex++;
      setTimeout(sendData, 1000); // Delay execution by 1 second before sending the next item
    });
}

sendData();

const app = express();
const port = 3005; // Change the port number if needed

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
