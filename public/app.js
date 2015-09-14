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

		$scope.paymentdetails = "Payment details";
		$scope.paymenttotal = "Total";
		$scope.paymenttotalvalue = $scope.price;
	};

	$scope.anotherPayment = function() {
		console.log("Make another Payment");

		$scope.cc = "";
		$scope.paymentdetails = "";
		$scope.paymenttotal = "";
		$scope.paymenttotalvalue = "";
	};

}]);