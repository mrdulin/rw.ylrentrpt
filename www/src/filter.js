angular
	.module('ylrent.rpt.filters')
	.filter('dateFormat', dateFormat)
	.filter('trim', trim);

function dateFormat() {
	return function(date) {
		return moment(date).utc().format('YYYY-M-D HH:mm');
	}
}

function trim() {
	return function(str) {
		return $.trim(str);
	}
}