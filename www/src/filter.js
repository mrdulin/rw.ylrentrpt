angular
	.module('ylrent.rpt.filters')
	.filter('dateFormat', dateFormat);

function dateFormat() {
	return function(date) {
		return moment(date).format('YYYY-M-D');
	}
}