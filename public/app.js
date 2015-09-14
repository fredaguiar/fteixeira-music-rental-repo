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

	$scope.submitEquipments = function() {
		console.log("submit Equipments");

		$scope.paymentdetails = "Payment received";
		$scope.paymenttotal = "Total";
		$scope.paymenttotalvalue = $scope.price;
	};

	$scope.restart = function() {
		console.log("restart");

		$scope.paymentdetails = "";
		$scope.paymenttotal = "";
		$scope.paymenttotalvalue = "";

		$scope.price = "";
		$scope.firstName = "";
		$scope.lastName = "";
		$scope.lastName = "";
		$scope.cardholderAddress = "";
		$scope.securityCode = "";
		$scope.cardNumber = "";
		$scope.cardExpiry = "";
	};

}]);