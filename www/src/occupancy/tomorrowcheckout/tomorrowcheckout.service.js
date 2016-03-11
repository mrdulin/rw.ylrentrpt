angular
	.module('ylrent.rpt.services')
	.factory('CheckOutService', CheckOutService);

CheckOutService.$inject = ['$log', 'CheckOut'];

function CheckOutService($log, CheckOut) {

	var service = {};

	angular.extend(service, {
		query: query
	});

	function query(date) {
		return CheckOut.query(date);
	}

	return service;
}