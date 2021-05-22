const http= require('http')
const hostname = 'localhost'
const port = 5000
const fs = require('fs')
const ini = require('ini')
const express = require('express')
var cors = require('cors')

const FILE = 'config/instance_ips.ini'

var config = ini.parse(fs.readFileSync(FILE, 'utf-8'))
const ServerObject = config.webserver
const ip = Object.keys(ServerObject)[0]

const app = express()
app.use(cors())
app.get('/', (req, res) => {
    res.send({'data': ip})
})

var server = app.listen(port, () => console.log('server is running'));