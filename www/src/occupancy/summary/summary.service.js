angular
	.module('ylrent.rpt.services')
	.factory('SummaryService', SummaryService);

SummaryService.$inject = ['$log', '$resource', 'Status', 'Hotel', '$filter'];

function SummaryService($log, $resource, Status, Hotel, $filter) {

	var service = {};

	angular.extend(service, {
		getSummary: getSummary,
		getOccupanySum: getOccupanySum,
		setOccupancyRate: setOccupancyRate,
		getHotels: getHotels		
	});



	function setOccupancyRate(summarys) {
		angular.forEach(summarys, function(summary){
			summary.occupanyRate = $filter('number')(summary.occupyRoomCount / summary.TotalRoomCount, 2)
		});
		return summarys;
	}

	function getOccupanySum(summarys) {
		var i = 0,
			len = summarys.length,
			summary = null,
			total = 0,
			occupany = 0;
		for(; i < len; i++){
			summary = summarys[i];
			occupany += summary.occupyRoomCount;
			total += summary.TotalRoomCount;
		}

		return {
			total: total,
			occupany: occupany
		};
	}

	function getHotels() {
		return Hotel.query();
	}

	function getSummary(date) {
		return Status.query(date);
	}

	return service;
}
