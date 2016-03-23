angular
	.module('ylrent.rpt.controllers')
	.controller('OooReasonController', OooReasonController);

function OooReasonController($log, oooRoomDetails) {
	var vm = this;

	angular.extend(vm, {
		oooRoomDetails:  oooRoomDetails
	});

	$

}