angular
	.module('ylrent.rpt.controllers')
	.controller('SummaryController', SummaryController);

SummaryController.$inject = ['$log', 'SummaryService', 'summarys', 'hotels', '$filter', '$scope', 'CommonService'];

function SummaryController($log, SummaryService, summarys, hotels, $filter, $scope, CommonService){
	var vm = this;

	angular.extend(vm, {
		summarys: summarys,
		occupany: null,
		predicate: '',
		reverse: true,
		hotels: hotels,
		selectedHotel: '',

		pagination: {
			totalItems: summarys.length,
			currentPage: 1,
			maxSize:  5,
			pageSize: 10
		},

		datepicker: {
			open: false,
			date: new Date(),
			options: {
			    maxDate: new Date(2020, 1, 1),
			    // minDate: new Date(),
			    startingDay: 1
			}
		},

		pageChanged: pageChanged,
		order: order,
		dateChange: dateChange,
		getOccupany: getOccupany,
		hotelSelect: hotelSelect,
		filterTableData: filterTableData

	});

	function hotelSelect() {
		$log.info(vm.selectedHotel);
		vm.pageSummarys = $filter('filter')(vm.summarys, {hotelName: vm.selectedHotel.hotelName});
		vm.pagination.totalItems = vm.pageSummarys.length;
		vm.pagination.currentPage = 1;
		pageChanged(vm.pageSummarys);
	}

	$scope.$watch('vm.selectedHotel', function(newVal) {
		if(newVal.length === 0) {
			filterTableData();
		}
	});

	getOccupany();
	function getOccupany() {
		vm.occupany = SummaryService.getOccupanySum(vm.summarys);
	}

	function dateChange() {
		var newDate = moment(vm.datepicker.date).format('YYYY-M-D');
		var params = {startDate: newDate, endDate: newDate};
		SummaryService.getSummary(params).$promise.then(function(data) {
			vm.summarys = SummaryService.setOccupancyRate(data);
			filterTableData();
			getOccupany();
		}, function(error) {
			alert(error.msg);	
		});
	}

	function filterTableData() {
		vm.pagination.currentPage = 1;
		vm.pagination.totalItems = vm.summarys.length;
		pageChanged();
	}

	pageChanged();
	function pageChanged(customSummarys) {
		var summaryDatas = customSummarys || vm.summarys;
		vm.pageSummarys = CommonService.getPage(vm.pagination.currentPage, vm.pagination.pageSize, summaryDatas);
	}

	function order(predicate) {
		vm.reverse = !vm.reverse;
		vm.predicate = predicate;
	}
}