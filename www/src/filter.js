angular
	.module('ylrent.rpt.filters')
	.filter('dateFormat', dateFormat);

function dateFormat() {
	return function(date) {
		return moment(date).utc().format('YYYY-M-D HH:mm');
	}
}