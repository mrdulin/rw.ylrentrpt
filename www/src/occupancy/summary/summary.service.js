angular
	.module('ylrent.rpt.services')
	.factory('SummaryService', SummaryService);

SummaryService.$inject = ['$log', '$resource', '$http'];

function SummaryService($log, $resource, $http) {

	var service = {};

	angular.extend(service, {
		query: query
	});

	function query() {
		return $http.get('/api/hotel');
	}

	return service;
}
