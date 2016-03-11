angular
	.module('ylrent.rpt.controllers')
	.controller('TomorrowcheckoutController', TomorrowcheckoutController);

TomorrowcheckoutController.$inject = ['$log', 'CheckOutService', 'CommonService'];

function TomorrowcheckoutController($log, CheckOutService, CommonService) {
	var vm = this;
	var startDate = moment(moment().subtract(1, 'd')),
		endDate = moment(),
		format = 'YYYY-M-D';

	var initDate = {startDate: startDate, endDate: endDate};
	var date = {startdate: startDate.format(format), enddate: endDate.format(format)};

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
		datePicker: {
			options: {
				autoApply: true,
				locale:  {
			        "format": format,
			        "separator": " ~ ",
			        "daysOfWeek": [
			            "周日",
			            "周一",
			            "周二",
			            "周三",
			            "周四",
			            "周五",
			            "周六"
			        ],
			        "monthNames": [
			            "一月",
			            "二月",
			            "三月",
			            "四月",
			            "五月",
			            "六月",
			            "七月",
			            "八月",
			            "九月",
			            "十月",
			            "十一月",
			            "十二月"
			        ],
			        "firstDay": 1
			    },
			    eventHandlers : {
		            'apply.daterangepicker': dateChange
		        }
			},
			date: initDate
		},

		query: query,
		order: order
	});

	function order(predicate) {
		vm.reverse = !vm.reverse;
		vm.predicate = predicate;
	}

	function dateChange() {
		query({
			startdate: vm.datePicker.date.startDate.format(format),
			enddate: vm.datePicker.date.endDate.format(format)
		});
	}

	query(date);
	function query(date) {
		CheckOutService.query(date).$promise.then(function(data) {
			$log.info(data);
			vm.datas = data;
		}, function(error) {
			alert(error.msg);
		});
	}


}