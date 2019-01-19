const express = require('express');
const app = express();

// Example directories as static files
app.use(express.static('example'));

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.listen(3000);
