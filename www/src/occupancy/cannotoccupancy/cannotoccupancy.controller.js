angular
	.module('ylrent.rpt.controllers')
	.controller('CannotoccupancyController', CannotoccupancyController);

CannotoccupancyController.$inject = ['$log', 'CannotOccupancyService'];

function CannotoccupancyController($log, CannotOccupancyService) {
	var vm = this;

	angular.extend(vm, {
		date: moment().format('YYYY-M-D'),
		rooms: null,
		queryCannotOccupancyRoom: queryCannotOccupancyRoom
	});

	queryCannotOccupancyRoom();
	function queryCannotOccupancyRoom() {
		var date = moment().format('YYYY-M-D'),
			params = {date: date};
		CannotOccupancyService.queryCannotOccupancyRoom(params).$promise.then(function(data) {
			vm.rooms = CannotOccupancyService.reconstructData(data);
		}, function(error) {
			alert(error.msg);
		});
	}
	
}