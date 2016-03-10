angular
	.module('ylrent.rpt.services')
	.factory('SummaryService', SummaryService);

SummaryService.$inject = ['$log', '$resource', 'Status', 'Hotel'];

function SummaryService($log, $resource, Status, Hotel) {

	var service = {};

	angular.extend(service, {
		getSummary: getSummary,
		getOccupanySum: getOccupanySum,
		getPageSummarys: getPageSummarys,
		setOccupancyRate: setOccupancyRate,
		getHotels: getHotels
	});

	function setOccupancyRate(summarys) {
		angular.forEach(summarys, function(summary){
			summary.occupanyRate = (summary.occupyRoomCount / summary.TotalRoomCount).toFixed(2);
		});
		return summarys;
	}

	function getPageSummarys(currentPage, pageSize, summarys) {

		var index = currentPage - 1;

		return summarys.slice(index, index + pageSize - 1);
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
