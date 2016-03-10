angular
	.module('ylrent.rpt.services')
	.factory('SummaryService', SummaryService);

SummaryService.$inject = ['$log', '$resource', 'Status'];

function SummaryService($log, $resource, Status) {

	var service = {};

	angular.extend(service, {
		getSummary: getSummary,
		getOccupanySum: getOccupanySum
	});

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
		}
	}

	function getSummary(date) {
		return Status.query({startDate: '2016-3-1', endDate: '2016-3-10'});
	}

	return service;
}
