angular
	.module('ylrent.rpt.services')
	.factory('CannotOccupancyService', CannotOccupancyService);

CannotOccupancyService.$inject = ['Room', '$log'];

function CannotOccupancyService(Room, $log) {

	var service = {};
	var statusList = ['deliver', 'notDelivered', 'notDecorated', 'decorating', 'clean', 'pendingFurniture', 'repair', 'longRent', 'total'];

	angular.extend(service, {
		queryCannotOccupancyRoom: queryCannotOccupancyRoom,
		reconstructData: reconstructData,
		getTotalData: getTotalData
	});

	return service;

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
					case '打扫':
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

		});

		_.each(newData, function(value, key) {
			var countList = _.values(value);
			newData[key].total = 0;
			_.each(countList, function(el, index) {
				newData[key].total += el;
			});
		});

		return newData;
	}

	function getTotalData(data) {
		$log.info(data);
		var totalData = [];

		_.each(statusList, function(status, index) {
			totalData[index] = {name: status};
			totalData[index]['count'] = _.chain(data)
				.values()
				.pluck(status)
				.compact()
				.reduce(function(memo, num) { 
					return memo + num; 
				}, 0)
				.value();
		});

		$log.info(totalData);
		return totalData;
	}

	function queryCannotOccupancyRoom(date) {
		return Room.query(date);
	}

}