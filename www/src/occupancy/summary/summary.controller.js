angular
	.module('ylrent.rpt.controllers')
	.controller('SummaryController', SummaryController);

SummaryController.$inject = ['$log', 'SummaryService', 'summarys'];

function SummaryController($log, SummaryService, summarys){
	var vm = this;

	var now = new Date(),
		tommorow = new Date().setDate(now.getDate() + 1);

	angular.extend(vm, {
		summarys: summarys,
		occupany: null,

		datepicker: {
			startOpen: false,
			endOpen: false,
			start: now,
			end: tommorow,
			options: {
			    formatYear: 'yyyy',
			    maxDate: new Date(2020, 1, 1),
			    minDate: new Date(),
			    startingDay: 1
			}
		}
	});

	vm.occupany = SummaryService.getOccupanySum(summarys);

}