angular
	.module('ylrent.rpt.services')
	.factory('CannotOccupancyService', CannotOccupancyService);

CannotOccupancyService.$inject = ['Room', '$log'];

function CannotOccupancyService(Room, $log) {

	var service = {};

	angular.extend(service, {
		queryCannotOccupancyRoom: queryCannotOccupancyRoom,
		reconstructData: reconstructData
	});

	function reconstructData(rawRoomDatas) {
		var newData = {},
			reasons = null;

		var data = _.groupBy(rawRoomDatas, function(room) {
			return room.hotelName;
		});

		_.each(data, function(value, key) {
			var reasons = _.pluck(value, 'oooReason');

			newData[key] = _.countBy(reasons, function(reason) {
				switch(reason) {
					case '交房':
						return 'deliver';
						break;
					case '开荒打扫':
						return 'clean';
						break;
					case '待送家具':
						return 'pendingFurniture';
						break;
					case '未交房':
						return 'notDelivered';
						break;
					case '未装修': 
						return 'notDecorated';
						break;
					case '维修':
						return 'repair';
						break;
					case '装修中':
						return 'decorating';
						break;
					case '长租准备':
						return 'longRent';
						break;
					default: 
						break;
				}
			});
		})	

		// $log.info(data);
		$log.info(newData);
		return newData;
	}

	function queryCannotOccupancyRoom(date) {
		return Room.query(date);
	}

	return service;
}