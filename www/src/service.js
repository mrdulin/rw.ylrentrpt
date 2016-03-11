angular
	.module('ylrent.rpt.services')
	.factory('CommonService', CommonService)
	.factory('Hotel', Hotel)
	.factory('Status', Status)
	.factory('Room', Room)

Hotel.$inject = ['$resource'];

function Hotel($resource) {
	var url = '/api/hotel';
	return $resource(url, {
		query: {method: 'GET', isArray: true}
	});
}

Status.$inject = ['$resource'];

function Status($resource) {
	var url = '/api/status/start/:startDate/end/:endDate',
		paramDefaults = {startDate: '@sDate', endDate: '@eDate'},
		actions = {
			query: {method: 'GET', isArray: true}
		};

	return $resource(url, paramDefaults, actions);
}

Room.$inject = ['$resource'];

function Room($resource) {
	var url = '/api/room/oooroom/date/:date',
		paramDefaults = {date: '@date'},
		actions = {
			query: {method: 'GET', isArray: true}
		};

	return $resource(url, paramDefaults, actions);
}

CommonService.$inject = ['$log'];

function CommonService($log) {

	var service = {};

	angular.extend(service, {
		getPage: getPage
	});

	function getPage(currentPage, pageSize, totalItems) {

		var index = currentPage - 1;	

		return totalItems.slice(index, index + pageSize - 1);
	}

	return service;
}