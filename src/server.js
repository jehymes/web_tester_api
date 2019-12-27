const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

require('./controllers/authController')(app);
require('./controllers/webTesterController')(app);

app.listen(3000);
