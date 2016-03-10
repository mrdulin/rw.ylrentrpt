angular
	.module('ylrent.rpt.services')
	.factory('Hotel', Hotel)
	.factory('Status', Status)

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