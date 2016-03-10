angular.module('ylrent.rpt', [
	'ui.router',
	'ngResource',
	'ngAnimate',
	'ui.bootstrap',
	'ngTouch',
	'ylrent.rpt.controllers',
	'ylrent.rpt.services',
]);

angular.module('ylrent.rpt.controllers', []);
angular.module('ylrent.rpt.services', []);

angular
	.module('ylrent.rpt.controllers')
	.controller('MainController', MainController);

MainController.$inject = ['$log'];

function MainController($log) {

	var vm = this;

	angular.extend(vm, {
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
						key: 'tomorrowoccupancy',
						name: '明日入住',
						baseKey: 'occupancy'
					},
					{
						key: 'tomorrowcheckout',
						name: '明日退房',
						baseKey: 'occupancy'
					}
				]
			},
			order: {
				name: '订单汇总',
				subMenus: [
					{
						key: 'daily',
						name: '日租订单',
						baseKey: 'order'
					}
				]
			}
		}
	})

}