
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8081;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// For all other requests, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server listening at http://localhost:${port}`);
  console.log(`Credits to syzdark`);
});
