angular
	.module('ylrent.rpt.services')
	.factory('CheckInService', CheckInService);

CheckInService.$inject = ['$log', 'CheckIn'];

function CheckInService($log, CheckIn) {

	var service = {};

	angular.extend(service, {
		query: query
	});

	function query(date) {
		return CheckIn.query(date);
	}

	return service;
}