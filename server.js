
var express = require('express');
var mongojs = require('mongojs');

// Create the application.
var app = express();

app.use(express.static(__dirname + '/public'))

// create database, tables and load data
var db = mongojs('EquipmentDB');
db.createCollection("equipment", { size : 6142800} );
var equipments = db.collection('equipment');

equipments.remove({key:"sound"}, function (err, docs) {
    console.log("truncate equipments" );
});

equipments.insert({key: 'sound', equipment: 'Eletric Guitar', model: 'Fender', price: '20'});
equipments.insert({key: 'sound', equipment: 'Bass Guitar', model: 'Ibanez', price: '30'});
equipments.insert({key: 'sound', equipment: 'Guitar Amp', model: 'Fender', price: '40'});

app.get('/equipmentlist', function(req, res) {

	equipments.find(function (err, docs) {
    	console.log("Find equipments" );
    	res.json(docs);
	})
});

console.log('Listening on port 3000...');
app.listen(3000);

