const express = require('express')
const routes = require('./routes')
var cors = require('cors');
require('./database/index')
const app = express()

app.use(cors());
app.use(express.json())
app.use(express.Router())
app.use(routes)

app.listen(3000)
