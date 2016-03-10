angular
	.module('ylrent.rpt')
	.config(config);

config.$inject = ['$stateProvider', '$urlRouterProvider', '$resourceProvider'];

function config($stateProvider, $urlRouterProvider, $resourceProvider) {

	$urlRouterProvider
		.when('', '/occupancy/summary')
		.when('/occupancy', '/occupancy/summary')
		.otherwise('/occupancy/summary');

 	$resourceProvider.defaults.stripTrailingSlashes = false;

	$stateProvider
		.state('occupancy', {
			url: '/occupancy',
			abstract: true,
			template: '<ui-view/>'
		})
		.state('occupancy.summary', {
			url: '/summary',
			templateUrl: './src/occupancy/summary/summary.html',
			controller: 'SummaryController as vm',
			resolve: {
				summarys: function(SummaryService, $log) {
					var today = moment().format('YYYY-M-DD');
					var date = {startDate: today, endDate: today};
					return SummaryService.getSummary(date).$promise.then(function(data) {
						return SummaryService.setOccupancyRate(data);
					}, function(error) {
						alert(error.msg);
					});
				},
				hotels: function(SummaryService, $log) {
					return SummaryService.getHotels().$promise.then(function(data) {
						return data;
					}, function(error) {
						alert(error.msg);
					});
				}
			},
			custom: {
				data: '汇总'
			}
		})
		.state('occupancy.cannotoccupancy', {
			url: '/cannotoccupancy',
			templateUrl: './src/occupancy/cannotoccupancy/cannotoccupancy.html',
			controller: 'CannotoccupancyController as vm',
			custom: {
				data: '不可入住'
			}
		})
		.state('occupancy.tomorrowoccupancy', {
			url: '/tomorrowoccupancy',
			templateUrl: './src/occupancy/tomorrowoccupancy/tomorrowoccupancy.html',
			controller: 'TomorrowoccupancyController as vm',
			custom: {
				data: '明日入住'
			}
		})	
		.state('occupancy.tomorrowcheckout', {
			url: '/tomorrowcheckout',
			templateUrl: './src/occupancy/tomorrowcheckout/tomorrowcheckout.html',
			controller: 'TomorrowcheckoutController as vm',
			custom: {
				data: '明日退房'
			}
		})
		.state('order', {
			url: '/order',
			abstract: true,
			template: '<ui-view/>'
		})
		.state('order.daily', {
			url: '/daily',
			templateUrl: './src/order/daily/daily.html',
			controller: 'DailyController as vm',
			custom: {
				data: '日租订单'
			}
		})
}