const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const app = express();

// use vue's built static files
const src = path.join(__dirname, 'dist') 
const staticFileMiddleware = express.static(src);
app.use(staticFileMiddleware);
app.use(history({
  disableDotRule: true,
  verbose: true
}));
app.use(staticFileMiddleware);

const port = 5555

app.get('/api/db', (req, res) => {
  res.status(201).send({message: "This is the POST /timesheets/upload endpoint"});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
})