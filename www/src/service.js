angular
	.module('ylrent.rpt.services')
	.factory('CommonService', CommonService)
	.factory('Hotel', Hotel)
	.factory('Status', Status)
	.factory('Room', Room)
	.factory('CheckIn', CheckIn)
	.factory('CheckOut', CheckOut)
	.factory('DailyRent', DailyRent)

Hotel.$inject = ['$resource'];

function Hotel($resource) {
	var url = '/api/hotel';
	return $resource(url, {
		query: {method: 'GET', isArray: true}
	});
}

Status.$inject = ['$resource'];

function Status($resource) {
	var url = '/api/status/summary/date/:date',
		paramDefaults = {date: '@date'},
		actions = {
			query: {method: 'GET', isArray: true}
		};

	return $resource(url, paramDefaults, actions);
}

Room.$inject = ['$resource'];

function Room($resource) {
	var url = '/api/room/ooorooms/date/:date',
		paramDefaults = {date: '@date'},
		actions = {
			query: {method: 'GET', isArray: true}
		};

	return $resource(url, paramDefaults, actions);
}

CheckIn.$Inject = ['$resource'];

function CheckIn($resource) {
	var url = '/api/order/checkins/date/:date',
		paramDefaults = {date: '@date'},
		actions = {
			query: {method: 'GET', isArray: true}
		};
	return $resource(url, paramDefaults, actions);
}

function CheckOut($resource) {
	var url = '/api/order/checkout/date/:date',
		paramDefaults = {date: '@date'},
		actions = {
			query: {method: 'GET', isArray: true}
		};
	return $resource(url, paramDefaults, actions);
}

DailyRent.$inject = ['$resource'];

function DailyRent($resource) {
	var url = '/api/order/dailyrents/start/:startdate/end/:enddate',
		paramDefaults = {startdate: '@sDate', enddate: '@eDate'},
		actions = {
			query: {method: 'GET', isArray: true}
		};

	return $resource(url, paramDefaults, actions);
}

CommonService.$inject = ['$log', '$resource'];

function CommonService($log, $resource) {

	var service = {};

	angular.extend(service, {
		getPage: getPage,
		formatDate: formatDate,
		getLastUpDatetime: getLastUpDatetime
	});

	function getPage(currentPage, pageSize, totalItems) {

		var index = currentPage - 1;	

		return totalItems.slice(index, index + pageSize - 1);
	}

	function getLastUpDatetime() {
		var url = '/api/update/lastupdatetime';

		var resource = $resource(url);

		return resource.get();
	}

	/**
	 * 格式化日期
	 * @param  {[type]} date 如"2016-03-11T14:00:00.000Z"
	 * @return {[type]}      "2016-3-11"
	 */
	function formatDate(date) {
		return moment(date).utc().format('YYYY-M-D');
	}

	return service;
}