var myApp = angular.module('myApp', []); 


myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
	console.log("Hello World from controller");

	$http.get('/equipmentlist').success(function(response) {
		console.log("Client requesting equipment list");		
		$scope.equipmentList = response;
	});

	$scope.toggleSelection = function(price) {
		$scope.price = price;
	};

	$scope.makePayment = function() {
		console.log("Make Payment");

		$http.get('/settings').success(function(response) {
			
			console.log("Client requesting data settings");					
			var key = response[0].pubKey;

			var result = new Payfirma(key, 
			{
				'card_number': $scope.cardNumber,
				'card_expiry_month': $scope.cardExpiryMonth,
				'card_expiry_year': $scope.cardExpiryYear,
				'cvv2': $scope.securityCode
			},
			{
				'first_name': $scope.firstName,
				'last_name': $scope.lastName
			}, 
			'http://localhost:3000/makepayment', 
			paymentConfirm);
		});
	};

	var paymentConfirm = function(response) {

		alert('Payment Confirmed! Transaction ID: ' + angular.fromJson(response));
	};

	$scope.restart = function() {
		console.log("restart");


		$scope.price = "";
		$scope.firstName = "";
		$scope.lastName = "";
		$scope.lastName = "";
		$scope.cardholderAddress = "";
		$scope.securityCode = "";
		$scope.cardNumber = "";
		$scope.cardExpiryMonth = "";
		$scope.cardExpiryYear = "";
	};

}]);