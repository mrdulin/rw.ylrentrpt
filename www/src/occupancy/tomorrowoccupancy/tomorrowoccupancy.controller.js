angular
	.module('ylrent.rpt.controllers')
	.controller('TomorrowoccupancyController', TomorrowoccupancyController);

TomorrowoccupancyController.$inject = ['$log', 'CheckInService', 'CommonService'];

function TomorrowoccupancyController($log, CheckInService, CommonService) {

	var vm = this;
	var format = 'YYYY-M-D';

	var date = {date: moment().format(format)};

	angular.extend(vm, {
		datas: [],
		formatDate: CommonService.formatDate,
		predicate: '',
		reverse: true,
		rentTypeMap: {
			all: '全部',
			daily: '日租',
			short: '中短租',
			long: '长租'
		},
		rentType: '全部',
		datepicker: {
			open: false,
			date: new Date(),
			options: {
			    maxDate: new Date(2020, 1, 1),
			    startingDay: 1
			}
		},
		query: query,
		order: order,
		dateChange: dateChange
	});

	function order(predicate) {
		vm.reverse = !vm.reverse;
		vm.predicate = predicate;
	}

	function dateChange() {
		query({date: moment(vm.datepicker.date).format(format)});
	}

	query(date);
	function query(date) {
		CheckInService.query(date).$promise.then(function(data) {
			vm.datas = data;
		}, function(error) {
			alert('请求数据失败，请重试！');
		});
	}

}