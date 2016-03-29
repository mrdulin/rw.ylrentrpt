angular
	.module('ylrent.rpt.controllers')
	.controller('DailyController', DailyController);

DailyController.$inject = ['$log', 'DailyService', 'CommonService'];

function DailyController($log, DailyService, CommonService) {
	var vm = this;

	var format = 'YYYY-M-D';
	var date = {date: moment().format(format)};

	angular.extend(vm, {
		formatDate: CommonService.formatDate,
		datas: null,
		query: query,
		order: order,
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
		}
	});

	function dateChange() {
		query({date: moment(vm.datepicker.date).format(format)});
	}

	function order(predicate) {
		vm.reverse = !vm.reverse;
		vm.predicate = predicate;
	}

	query(date);
	function query(date) {
		DailyService.query(date).$promise.then(function(data) {
			vm.datas = data;
			$log.info(data);
		}, function(error) {
			alert(error.msg);
		});
	}


}