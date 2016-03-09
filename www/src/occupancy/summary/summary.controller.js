angular
	.module('ylrent.rpt.controllers')
	.controller('SummaryController', SummaryController);

SummaryController.$inject = ['$log', 'SummaryService', 'hotelList'];

function SummaryController($log, SummaryService, hotelList){
	var vm = this;

	angular.extend(vm, {
		hotelList: hotelList
	});


}