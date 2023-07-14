const express = require('express');
const app = express();
const port = 3000;
app.use('/src',express.static('src'));

app.use((req, res) => res.sendFile('./index.html', { root: __dirname }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));