
var express = require('express');
var mongojs = require('mongojs');
var url = require('url') ;
var request = require('request');

// Create the application.
var app = express();

app.use(express.static(__dirname + '/public'))

// create database, tables and load data
var db = mongojs('EquipmentDB');
db.createCollection("equipment", { size : 6142800} );
var equipments = db.collection('equipment');

equipments.remove({key: "sound"}, function (err, docs) {
	if(err){
		return console.dir(err); 
	}
    console.log("equipments data truncated" );
});


// load equipment to the DB. It is not the best solution but for convernience it will be done here
equipments.insert({key: 'sound', equipment: 'Eletric Guitar', model: 'Fender', price: '20'});
equipments.insert({key: 'sound', equipment: 'Bass Guitar', model: 'Ibanez', price: '30'});
equipments.insert({key: 'sound', equipment: 'Guitar Amp', model: 'Fender', price: '40'}, function (err, docs) {
	if(err) {
		return console.dir(err); 
	}
    console.log("equipments data loade" );
});

// ecommerce settings
// NOTE: for security purposes these settings should be loaded by another application.
// However, for convenience and testing purposes they will be added here
var settings = db.collection('setting');
settings.remove({merchantId: "2839cfc514"}, function (err, docs) {
	if(err) {
		return console.dir(err); 
	}
    console.log('Settings data truncated');
});
settings.insert({
	merchantId: '2839cfc514', 
	apiKey: 'ac67fba8be73b44744e02a24897be0e9323170a2', 
	pubKey: '2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d4d494942496a414e42676b71686b6947397730424151454641414f43415138414d49494243674b4341514541704b74465961544561623035653578632f436f394844474a70624d517a6f3971344e5948712b5343724c6174736e794c5a6c724969566764446c4a5967463156664d71754d396c5a6277464d51574e626a38535a6369326672694a715a6c65457469364c30782b2b4d5875576e464e7a30594970313638656a41504366616246687a4772477046472b3142334b6e4a565a644b4d7665393248687664716754796f435266645843654e795a3961385a4f2f4677365150793836342b7661664a59674b58737062346c5a47627878474358797155712b65445153494e4f5038724576784b4a50725642566e5058647a4776683064445a616c48645a4f447a5771556139434c31587a6c6d486c37695271477670542b38485257666238537467465a6a3032663761334d694a58492f2b6b7948434b505a434a31696644372b595739696a7248494754542b354a785672627a7873365345774944415141422d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d',
	hostname: 'ecom.payfirma.com'
}, function (err, docs) {
	if(err) { 
		return console.dir(err); 
	}
    console.log('Settings data loaded');
});

// retrieve all the equipments from DB
app.get('/equipmentlist', function(req, res) {

	equipments.find(function (err, docs) {
    	console.log("Find equipments" );
    	res.json(docs);
	})
});

// retrieve settings from DB, such as merchantId, apiKey, pubKey
app.get('/settings', function(req, res) {

	settings.find(function (err, docs) {
    	console.log("Find settings" );
    	res.json(docs);
	})
});

app.post('/makepayment', function(req, res) {

  	var qs = require('querystring');
  	var data = '';
  	var postData;
  	req.on('data', function(chunk) {
  		data += chunk;
  	});
  	req.on('end', function() {
  		postData = qs.parse(data);
  	});

	settings.find(function (err, docs) {

		console.log("Make Payment");
		if(err) {
			console.dir("Make Paymentas failed! Error: " + err); 
			res.send(500);
		}

    	var data = docs[0];

    	console.log('-----card_number:' + postData.card_number);
    	console.log('-----token:' + postData.token);
    	console.log('-----last_name:' + postData.last_name);

    	request({
    		uri: 'https://ecom.payfirma.com/sale/?key=' + data.apiKey + '&merchant_id=' + data.merchantId + '&test_mode=true',
    		method: "POST",
    		form: {
	    		'amount' : '100',
	    		'card_number': '4111111111111111',
	    		'card_expiry_month': '11',
	    		'card_expiry_year' : '16',
	    		'cvv2' : '123'
    		}
    	}, function(error, response, body) {

			if(error) {
				res.json("failed post request to ecom.payfirma.com. Error: " + err + " - code: "+ res.statusCode);
				return;
			} 
			var tid = JSON.parse(body);	  
			console.dir("tid.transaction_id: " + tid.transaction_id);   		
    		res.json(tid.transaction_id);
    	});
	
	})

});

console.log('Listening on port 3000...');
app.listen(3000);

