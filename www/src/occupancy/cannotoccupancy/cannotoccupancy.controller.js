angular
	.module('ylrent.rpt.controllers')
	.controller('CannotoccupancyController', CannotoccupancyController)
	.filter('mapToArray', mapToArray);

CannotoccupancyController.$inject = ['$log', 'CannotOccupancyService', '$filter'];

function CannotoccupancyController($log, CannotOccupancyService, $filter) {
	var vm = this;

	angular.extend(vm, {
		date: moment().format('YYYY-M-D'),
		dataMap: null,
		dataArr: null,
		totalData: null,
		predicate: '',
		reverse: true,
		queryCannotOccupancyRoom: queryCannotOccupancyRoom,
		order: order
	});

	queryCannotOccupancyRoom();
	function queryCannotOccupancyRoom() {
		var date = moment().format('YYYY-M-D'),
			params = {date: date};
		CannotOccupancyService.queryCannotOccupancyRoom(params).$promise.then(function(data) {
			vm.dataMap = CannotOccupancyService.reconstructData(data);
			vm.totalData = CannotOccupancyService.getTotalData(vm.dataMap);
			vm.dataArr = $filter('mapToArray')(vm.dataMap);
		}, function(error) {
			alert(error.msg);
		});
	}

	function order(predicate) {
		if(!predicate) return;

		vm.predicate = predicate;
		vm.reverse = !vm.reverse;
	}
	
}

mapToArray.$inject = ['$log'];

function mapToArray($log) {
	return function(obj) {
		if(!angular.isObject(obj)) return obj;
		return Object.keys(obj).map(function(key) {
			obj[key]['key'] = key;
	        return obj[key];
  	    });
	}
}