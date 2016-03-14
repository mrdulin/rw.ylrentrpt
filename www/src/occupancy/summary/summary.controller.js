angular
	.module('ylrent.rpt.controllers')
	.controller('SummaryController', SummaryController);

SummaryController.$inject = ['$log', 'SummaryService', 'summarys', 'hotels', '$filter', '$scope', 'CommonService'];

function SummaryController($log, SummaryService, summarys, hotels, $filter, $scope, CommonService){
	var vm = this;

	angular.extend(vm, {
		summarys: summarys,
		occupany: null,
		predicate: '',
		reverse: true,
		hotels: hotels,
		selectedHotel: '',

		datepicker: {
			open: false,
			date: new Date(),
			options: {
			    maxDate: new Date(2020, 1, 1),
			    startingDay: 1
			}
		},

		order: order,
		dateChange: dateChange,
		getOccupany: getOccupany,

		tableHeaders: [
			{
				txt: '小区',
				predicate: ''
			},
			{
				txt: '入住率',
				predicate: 'occupanyRate'
			},
			{
				txt: '入住数',
				predicate: 'occupyRoomCount'
			},
			{
				txt: '不可用房',
				predicate: 'oooRoomCount'
			},
			{
				txt: '总数',
				predicate: 'TotalRoomCount'
			},
		]

	});

	getOccupany();
	function getOccupany() {
		vm.occupany = SummaryService.getOccupanySum(vm.summarys);
	}

	function dateChange() {
		var newDate = moment(vm.datepicker.date).format('YYYY-M-D');
		var params = {startDate: newDate, endDate: newDate};
		SummaryService.getSummary(params).$promise.then(function(data) {
			vm.summarys = SummaryService.setOccupancyRate(data);
			getOccupany();
		}, function(error) {
			alert(error.msg);	
		});
	}

	function order(predicate) {
		if(!predicate) return;

		vm.reverse = !vm.reverse;
		vm.predicate = predicate;
	}
}