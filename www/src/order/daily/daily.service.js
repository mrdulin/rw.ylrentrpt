angular
	.module('ylrent.rpt.services')
	.factory('DailyService', DailyService);

DailyService.$inject = ['$log', 'DailyRent'];

function DailyService($log, DailyRent) {

	var service = {};

	angular.extend(service, {
		query: query
	});

	function query(date) {
		return DailyRent.query(date);
	}

	return service;
}