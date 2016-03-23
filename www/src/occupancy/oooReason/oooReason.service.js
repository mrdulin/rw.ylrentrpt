angular
	.module('ylrent.rpt.services')
	.factory('OooReasonService', OooReasonService);

function OooReasonService($log, $resource) {
	var service = {};

	angular.extend(service, {
		getOooroomDetail: getOooroomDetail,
		setVmData: setVmData 
	});

	function getOooroomDetail() {
		var url = '/api/room/oooroomdetails/date/:date';
		return $resource(url, {date: '@date'});
	}

	function setVmData(data) {
		var tmpData = _.groupBy(data, function(room) {
			return room.oooReason;
		});

		var cleanData = tmpData['打扫'];
		tmpData['开荒打扫'] = tmpData['开荒打扫'].concat(cleanData);
		delete tmpData['打扫'];
		$log.info(tmpData);

		return tmpData;

	}

	return service;
}