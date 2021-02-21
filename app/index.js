const app = require('express')()
import simpleData from "./simpleCoords4326.json"
import geojsonData from "./geojsonCoords4326.json"
import geojsonTest from "./Geotest2_4326.geojson"
var path = require('path');

app.get('/api/simpleCoords4326', (req, res) =>{
  res.send(JSON.stringify(simpleData))
})

app.get('/api/geojsonCoords4326', (req, res) =>{
  res.send(JSON.stringify(geojsonData))
})

app.get('/api/geojsonTest4326', (req, res) =>{
  res.sendFile(path.join(__dirname, '../app', 'Geotest2_4326.geojson'));
})

module.exports = app