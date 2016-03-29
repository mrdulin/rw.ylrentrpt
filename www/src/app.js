angular.module('ylrent.rpt', [
	'ui.router',
	'ngResource',
	'angular-loading-bar',
	'ngAnimate',
	'ui.bootstrap',
	'ngTouch',
	'ylrent.rpt.controllers',
	'ylrent.rpt.services',
	'ylrent.rpt.directives',
	'ylrent.rpt.filters',
	'ylrent.rpt.templateCache'
]);

angular.module('ylrent.rpt.controllers', []);
angular.module('ylrent.rpt.services', []);
angular.module('ylrent.rpt.directives', []);
angular.module('ylrent.rpt.filters', []);
angular.module('ylrent.rpt.templateCache', []);

angular
	.module('ylrent.rpt.controllers')
	.controller('MainController', MainController);

MainController.$inject = ['$log', 'CommonService'];

function MainController($log, CommonService) {

	var vm = this;

	angular.extend(vm, {
		lastupdatetime: '',
		sidebar: {
			occupancy: {
				name: '入住情况',
				subMenus: [
					{
						key: 'summary',
						name: '汇总',
						baseKey: 'occupancy'
					},
					{
						key: 'cannotoccupancy',
						name: '不可用房',
						baseKey: 'occupancy'
					},
					{
						key: 'oooReason',
						name: '不可用房明细',
						baseKey: 'occupancy'
					},
					{
						key: 'tomorrowoccupancy',
						name: '入住统计',
						baseKey: 'occupancy'
					},
					{
						key: 'tomorrowcheckout',
						name: '退房统计',
						baseKey: 'occupancy'
					}
				]
			}
			// order: {
			// 	name: '订单汇总',
			// 	subMenus: [
			// 		{
			// 			key: 'daily',
			// 			name: '日租订单',
			// 			baseKey: 'order'
			// 		}
			// 	]
			// }
		}
	});

	var lastupdatetimePromise = CommonService.getLastUpDatetime().$promise.then(function(data) {
		vm.lastupdatetime = data;
	}, function(err) {
		alert(err.msg);
	});
}