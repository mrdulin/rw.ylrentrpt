angular
	.module('ylrent.rpt.services')
	.factory('Hotel', Hotel);

Hotel.$inject = ['$resource'];

function Hotel() {
	return $resource('/api/hotel', paramDefaults, actions)
}