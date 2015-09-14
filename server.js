
var express = require('express');
var mongojs = require('mongojs');
var https = require('https');

// Create the application.
var app = express();

app.use(express.static(__dirname + '/public'))

// create database, tables and load data
var db = mongojs('EquipmentDB');
db.createCollection("equipment", { size : 6142800} );
var equipments = db.collection('equipment');

equipments.remove({key: "sound"}, function (err, docs) {
    console.log("truncate equipments" );
});


equipments.insert({key: 'sound', equipment: 'Eletric Guitar', model: 'Fender', price: '20'});
equipments.insert({key: 'sound', equipment: 'Bass Guitar', model: 'Ibanez', price: '30'});
equipments.insert({key: 'sound', equipment: 'Guitar Amp', model: 'Fender', price: '40'});

// ecommerce settings
/*
var settings = db.collection('setting');
equipments.remove({merchantId: "2839cfc514"}, function (err, docs) {
    console.log("truncate settings" );
});
settings.insert({
	merchantId: '2839cfc514', 
	apiKey: 'ac67fba8be73b44744e02a24897be0e9323170a2', 
	pubKey: '2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d4d494942496a414e42676b71686b6947397730424151454641414f43415138414d49494243674b4341514541704b74465961544561623035653578632f436f394844474a70624d517a6f3971344e5948712b5343724c6174736e794c5a6c724969566764446c4a5967463156664d71754d396c5a6277464d51574e626a38535a6369326672694a715a6c65457469364c30782b2b4d5875576e464e7a30594970313638656a41504366616246687a4772477046472b3142334b6e4a565a644b4d7665393248687664716754796f435266645843654e795a3961385a4f2f4677365150793836342b7661664a59674b58737062346c5a47627878474358797155712b65445153494e4f5038724576784b4a50725642566e5058647a4776683064445a616c48645a4f447a5771556139434c31587a6c6d486c37695271477670542b38485257666238537467465a6a3032663761334d694a58492f2b6b7948434b505a434a31696644372b595739696a7248494754542b354a785672627a7873365345774944415141422d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d'
});
*/

app.get('/equipmentlist', function(req, res) {

	equipments.find(function (err, docs) {
    	console.log("Find equipments" );
    	res.json(docs);
	})
});

app.post('/makepayment', function(req, res) {

	console.log("Make Payment");

	var options = {
		hostname: 'ecom.payfirma.com',
		port: 443,
		path: '?key=ac67fba8be73b44744e02a24897be0e9323170a2&merchant_id=2839cfc514&test_mode=true',
		method: 'POST'
	};

	var payfirma = https.request(options, function(res) {
		console.log("statusCode: ", res.statusCode);
	});
	payfirma.end();

	res.json({});
});

console.log('Listening on port 3000...');
app.listen(3000);

